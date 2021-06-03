import { Card } from '@models/card';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExtendedSocket } from 'src/interfaces/extended-socket';
import { Lobby } from 'src/interfaces/lobby';
import { OhHell } from 'src/interfaces/oh-hell';
import { GameService } from 'src/services/game/game.service';
import { LobbyService } from 'src/services/lobby/lobby.service';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN, methods: ['GET', 'POST'] },
})
export class OhHellGateway implements OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(private gameService: GameService, private lobbyService: LobbyService) {}

  public handleDisconnect(socket: ExtendedSocket): void {
    const { privateId } = socket;

    const game = this.gameService.getGame(socket.lobbyId);
    if (!game) {
      return;
    }

    const player = game.getPlayer(privateId);
    if (!player) {
      return;
    }

    player.disconnected = true;
    this.server.to(game.id).emit('oh-hell/player-update', player.getInfo());

    const { isAllDisconnected } = game;
    if (isAllDisconnected) {
      this.gameService.removeGame(game);
    }
  }

  @SubscribeMessage('oh-hell/reconnect')
  public onReconnect(@ConnectedSocket() socket: ExtendedSocket, @MessageBody() lobbyId: string): void {
    const { privateId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;
    if (!game) {
      return;
    }

    const player = game.getPlayer(privateId);
    if (!player) {
      return;
    }

    player.socketId = socket.id;
    player.disconnected = false;

    socket.lobbyId = game.id;
    socket.join(game.id);

    this.server.to(game.id).emit('oh-hell/player-update', player.getInfo());

    const trump = game.trump;
    const hand = game.getHand(privateId);
    const playedCards = game.getPlayedCards();
    const round = game.round;
    const scores = game.getAllScores();
    const turn = game.getPlayerForTurn()?.getInfo();
    const shouldBid = !game.hasAllBids();
    const illegalBid = game.getIllegalBid();
    socket.emit('oh-hell/game-state', { trump, hand, playedCards, round, scores, turn, shouldBid, illegalBid });
  }

  @SubscribeMessage('oh-hell/ready')
  public onReady(@ConnectedSocket() socket: ExtendedSocket): void {
    const { lobbyId, privateId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;
    if (!game) {
      return;
    }

    const { players, roundsToPlay } = game;
    socket.emit('oh-hell/game-info', { players: players.map((p) => p.getInfo()), roundsToPlay });

    game.setReady(privateId);
    if (!game.isAllReady || game.hasStarted) {
      return;
    }

    this.nextRound(game);
  }

  @SubscribeMessage('oh-hell/place-bid')
  public onBidPlaced(@ConnectedSocket() socket: ExtendedSocket, @MessageBody() bid: number): void {
    const { lobbyId, privateId } = socket;
    const game = this.gameService.getGame(lobbyId) as OhHell;

    if (!game || game.hasAllBids() || game.getPlayerForTurn().privateId !== privateId) {
      return;
    }

    if (game.isLastTurn && !game.isValidBid(bid)) {
      return;
    }

    game.setBid(privateId, bid);
    const player = game.getPlayer(privateId)?.getInfo();
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
    const { lobbyId, privateId } = socket;

    const game = this.gameService.getGame(lobbyId) as OhHell;
    if (!game || game.getPlayerForTurn().privateId !== privateId) {
      return;
    }

    if (!game.hasCard(privateId, card) || !game.isValidPlay(privateId, card)) {
      return;
    }

    game.setCardPlayed(privateId, card);

    const { isLastHandEmpty, isLastRound, isLastTurn } = game;
    this.server.to(game.id).emit('oh-hell/card-played', { card, isLast: isLastTurn, isFinal: isLastHandEmpty && isLastRound });

    if (isLastTurn) {
      const roundWinner = game.getRoundWinner();
      this.server.to(game.id).emit('oh-hell/round-winner', roundWinner.getInfo());
      game.addTrickWon(roundWinner.privateId);

      game.resetTurn();
      if (!isLastHandEmpty && !isLastRound) {
        game.setPlayerTurn(roundWinner);
        this.nextPlayer(game, false);
      } else if (isLastHandEmpty && !isLastRound) {
        this.server.to(game.id).emit('oh-hell/scores', game.getScoreForRound(game.round));
        this.nextRound(game);
      } else {
        this.server.to(game.id).emit('oh-hell/scores', game.getScoreForRound(game.round));

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
      game.setHand(player.privateId, hand);
      this.server.to(player.socketId).emit('oh-hell/round-info', { hand, trump: game.trump, round: game.round });
    });

    this.nextPlayer(game, true);
  }

  private nextPlayer(game: OhHell, shouldBid: boolean): void {
    game.nextTurn();

    const player = game.getPlayerForTurn()?.getInfo();
    const illegalBid = game.isLastTurn ? game.getIllegalBid() : -1;
    this.server.to(game.id).emit('oh-hell/turn', { player, shouldBid, illegalBid });
  }
}
