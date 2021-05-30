import { Card } from '@models/card';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExtendedSocket } from 'src/interfaces/extended-socket';
import { Lobby } from 'src/interfaces/lobby';
import { OhHell } from 'src/interfaces/oh-hell';
import { GameService } from 'src/services/game/game.service';
import { LobbyService } from 'src/services/lobby/lobby.service';

@WebSocketGateway({
  cors: { origin: ['http://localhost:4200', 'http://localhost:8080'], methods: ['GET', 'POST'] },
})
export class OhHellGateway implements OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(private gameService: GameService, private lobbyService: LobbyService) {}

  public handleDisconnect(socket: ExtendedSocket): void {
    const game = this.gameService.getGame(socket.lobbyId);
    if (!game) {
      return;
    }

    const player = game.getPlayer(socket.id);
    if (!player) {
      return;
    }

    player.disconnected = true;
    this.server.to(game.id).emit('oh-hell/player-disconnect', player);

    const { isAllDisconnected } = game;
    if (isAllDisconnected) {
      this.gameService.removeGame(game);
    }
  }

  @SubscribeMessage('oh-hell/ready')
  public onReady(@ConnectedSocket() socket: ExtendedSocket): void {
    const { lobbyId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;
    if (!game) {
      return;
    }

    const { players, roundsToPlay } = game;
    socket.emit('oh-hell/game-info', { players, roundsToPlay });

    game.setReady(socket.id);
    if (!game.isAllReady) {
      return;
    }

    if (!game.hasStarted) {
      this.nextRound(game);
    }
  }

  @SubscribeMessage('oh-hell/place-bid')
  public onBidPlaced(@ConnectedSocket() socket: ExtendedSocket, @MessageBody() bid: number): void {
    const { lobbyId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;

    if (!game || game.getPlayerForTurn().socketId !== socket.id) {
      return;
    }

    if (game.isLastTurn && !game.isValidBid(bid)) {
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
    if (!game || game.getPlayerForTurn().socketId !== socket.id) {
      return;
    }

    if (!game.hasCard(socket.id, card) || !game.isValidPlay(socket.id, card)) {
      return;
    }

    game.setCardPlayed(socket.id, card);

    const isLast = game.isLastTurn;
    const isFinal = game.isLastHandEmpty && game.isLastRound;
    this.server.to(game.id).emit('oh-hell/card-played', { card, isLast, isFinal });

    if (isLast) {
      const roundWinner = game.getRoundWinner();
      this.server.to(game.id).emit('oh-hell/round-winner', roundWinner);
      game.addTrickWon(roundWinner.socketId);

      game.resetTurn();
      if (!isLast && !isFinal) {
        game.setPlayerTurn(roundWinner);
        this.nextPlayer(game, false);
      } else if (isLast && !isFinal) {
        this.server.to(game.id).emit('oh-hell/scores', game.getScores());
        this.nextRound(game);
      } else {
        this.server.to(game.id).emit('oh-hell/scores', game.getScores());

        const lobby = new Lobby(game.host, game.id, game.players);
        this.lobbyService.addLobby(lobby);
      }
    } else {
      this.nextPlayer(game, false);
    }
  }

  private nextRound(game: OhHell): void {
    game.nextRound();

    const { deck } = game;
    deck.shuffle();

    game.trump = deck.draw();
    game.players.forEach((player) => {
      const hand = deck.getCards(game.amountOfCardsToGive);
      game.setHand(player.socketId, hand);
      this.server.to(player.socketId).emit('oh-hell/round-info', { hand, trump: game.trump, round: game.round });
    });

    this.nextPlayer(game, true);
  }

  private nextPlayer(game: OhHell, shouldBid: boolean): void {
    game.nextTurn();

    const player = game.getPlayerForTurn();
    const illegalBid = game.isLastTurn ? game.getIllegalBid() : -1;
    this.server.to(game.id).emit('oh-hell/turn', { player, shouldBid, illegalBid });
  }
}
