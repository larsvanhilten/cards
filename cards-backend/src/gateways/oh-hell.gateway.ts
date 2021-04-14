import { Card } from '@models/card';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExtendedSocket } from 'src/interfaces/extended-socket';
import { OhHell } from 'src/interfaces/oh-hell';
import { GameService } from 'src/services/game/game.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class OhHellGateway implements OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(private gameService: GameService) {}

  public handleDisconnect(_: ExtendedSocket): void {
    //
  }

  @SubscribeMessage('oh-hell/ready')
  public onReady(@ConnectedSocket() socket: ExtendedSocket): void {
    const { lobbyId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;
    if (!game) {
      return;
    }

    game.setReady(socket.id);
    if (!game.isAllReady) {
      return;
    }

    this.nextRound(game);
  }

  @SubscribeMessage('oh-hell/place-bid')
  public onBidPlaced(@ConnectedSocket() socket: ExtendedSocket, @MessageBody() bid: number): void {
    const { lobbyId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;
    if (!game) {
      return;
    }

    game.setBid(socket.id, bid);
    const player = game.getPlayer(socket.id);
    this.server.to(game.id).emit('oh-hell/bid-placed', { bid, player, isLast: game.isLastTurn });

    if (game.isLastTurn) {
      game.resetTurn();
      this.nextPlayer(game, false);
    } else {
      this.nextPlayer(game, true);
    }
  }

  @SubscribeMessage('oh-hell/play-card')
  public onCardPlayed(@ConnectedSocket() socket: ExtendedSocket, @MessageBody() card: Card): void {
    const { lobbyId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;
    if (!game) {
      return;
    }

    game.setCardPlayed(socket.id, card);
    this.server.to(game.id).emit('oh-hell/card-played', card);

    if (game.isLastTurn) {
      const roundWinner = game.getRoundWinner();
      this.server.to(game.id).emit('oh-hell/round-winner', roundWinner);
      game.addTrickWon(roundWinner.socketId);

      const { scores } = game;
      this.server.to(game.id).emit('oh-hell/scores', scores);

      game.resetTurn();
      if (!game.isLastHandEmpty && !game.isLastRound) {
        game.setPlayerTurn(roundWinner);
        this.nextPlayer(game, false);
      } else if (game.isLastHandEmpty && !game.isLastRound) {
        game.nextRound();
        this.nextRound(game);
      } else {
        this.server.to(game.id).emit('oh-hell/finished');
      }
    } else {
      this.nextPlayer(game, false);
    }
  }

  private nextRound(game: OhHell): void {
    const { deck } = game;
    deck.shuffle();

    game.trump = deck.draw();
    game.players.forEach((player) => {
      const hand = deck.getCards(game.round + 1);
      game.setHand(player.socketId, hand);
      this.server.to(player.socketId).emit('oh-hell/round-info', { hand, trump: game.trump });
    });

    this.nextPlayer(game, true);
  }

  private nextPlayer(game: OhHell, shouldBid: boolean): void {
    const player = game.getPlayerForTurn();
    const nextPlayer = game.getNextPlayerForTurn();

    this.server.to(game.id).emit('oh-hell/turn', { player, nextPlayer, shouldBid });
    game.nextTurn();
  }
}
