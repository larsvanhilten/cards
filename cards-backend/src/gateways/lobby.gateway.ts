import { GameType } from '@models/game-type';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExtendedSocket } from 'src/interfaces/extended-socket';
import { Lobby } from 'src/interfaces/lobby';
import { OhHell } from 'src/interfaces/oh-hell';
import { Player } from 'src/interfaces/player';
import { GameService } from 'src/services/game/game.service';
import { LobbyService } from 'src/services/lobby/lobby.service';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN, methods: ['GET', 'POST'] },
})
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(private lobbyService: LobbyService, private gameService: GameService) {}

  public handleConnection(socket: ExtendedSocket): void {
    const { username, publicId, privateId } = socket.handshake.query;
    socket.privateId = privateId;
    socket.publicId = publicId;
    socket.username = username;

    socket.join('lobbies');
  }

  public handleDisconnect(socket: ExtendedSocket): void {
    this.leaveLobby(socket, true);
  }

  @SubscribeMessage('leave-lobby')
  public leaveLobby(@ConnectedSocket() socket: ExtendedSocket, isDisconnected = false): void {
    socket.join('lobbies');

    const { lobbyId, privateId } = socket;
    const lobby = this.lobbyService.getLobby(lobbyId);
    if (!lobby) {
      return;
    }

    socket.leave(lobby.id);
    const isHost = lobby.host.privateId === privateId;
    const { host, player } = lobby.removePlayer(privateId);
    if (player) {
      this.server.to(lobbyId).emit('player-left', player.getInfo());
      socket.lobbyId = isDisconnected ? socket.lobbyId : null;
    }

    if (isHost && host) {
      this.server.to(lobbyId).emit('host-changed', host.getInfo());
    } else if (isHost && !host) {
      this.lobbyService.removeLobby(lobby);
      this.server.to('lobbies').emit('lobby-removed', lobbyId);
    }
  }

  @SubscribeMessage('create-lobby')
  public createLobby(@ConnectedSocket() socket: ExtendedSocket): void {
    const { username, publicId, privateId } = socket;
    const host = new Player(username, publicId, privateId, socket.id);
    const lobby = new Lobby(host);

    socket.lobbyId = lobby.id;
    socket.leave('lobbies');
    socket.join(lobby.id);

    this.lobbyService.addLobby(lobby);
    socket.emit('create-lobby-response', lobby.id);
    this.server.to('lobbies').emit('lobby-created', lobby.getInfo());
  }

  @SubscribeMessage('join-lobby')
  public joinLobby(@ConnectedSocket() socket: ExtendedSocket, @MessageBody() lobbyId: string): void {
    const { username, publicId, privateId } = socket;
    const player = new Player(username, publicId, privateId, socket.id);

    const lobby = this.lobbyService.getLobby(lobbyId);
    const hasJoinedLobby = lobby?.addPlayer(player);

    if (hasJoinedLobby) {
      this.leaveLobby(socket);
      socket.lobbyId = lobby.id;

      socket.leave('lobbies');
      socket.emit('join-lobby-response', lobby.id);

      socket.join(lobby.id);
      socket.to(lobby.id).emit('player-joined', player.getInfo());
    } else {
      socket.emit('join-lobby-response', { error: 'Failed to join lobby' });
    }
  }

  @SubscribeMessage('get-lobbies')
  public getLobbies(@ConnectedSocket() socket: Socket): void {
    const lobbies = this.lobbyService.lobbies.map((lobby) => lobby.getInfo());
    socket.emit('get-lobbies-response', lobbies);
  }

  @SubscribeMessage('get-lobby')
  public getLobby(@ConnectedSocket() socket: Socket, @MessageBody() lobbyId: string): void {
    const lobby = this.lobbyService.getLobby(lobbyId);
    socket.emit('get-lobby-response', lobby?.getInfo());
  }

  @SubscribeMessage('start-lobby')
  public startLobby(@ConnectedSocket() socket: ExtendedSocket): void {
    const { lobbyId, privateId } = socket;
    const lobby = this.lobbyService.getLobby(lobbyId);
    if (!lobby) {
      return;
    }

    const isHost = lobby.host.privateId === privateId;
    const canStart = OhHell.canStart(lobby);
    if (!isHost || !canStart) {
      return;
    }

    this.lobbyService.removeLobby(lobby);
    const ohHell = new OhHell(lobby);
    this.gameService.addGame(ohHell);

    this.server.to(lobbyId).emit('lobby-starting', GameType.OH_HELL);
  }
}
