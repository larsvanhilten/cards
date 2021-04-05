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
import { Player } from 'src/interfaces/player';
import { LobbyService } from 'src/services/lobby/lobby.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(private lobbyService: LobbyService) {}

  public handleConnection(socket: Socket): void {
    socket.join('lobbies');
  }

  public handleDisconnect(socket: ExtendedSocket): void {
    const { lobbyId } = socket;

    const lobby = this.lobbyService.getLobby(lobbyId);
    if (!lobby) {
      return;
    }

    const { host, player } = lobby.removePlayer(socket.id);
    if (player) {
      this.server.to(lobbyId).emit('player-left', player);
    }

    if (host) {
      this.server.to(lobbyId).emit('host-changed', host);
    } else {
      this.lobbyService.removeLobby(lobby);
      this.server.to('lobbies').emit('lobby-removed', lobbyId);
    }
  }

  @SubscribeMessage('create-lobby')
  public createLobby(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() { username }: any,
  ): void {
    const host = new Player(username, socket.id);
    const lobby = new Lobby(host);

    socket.lobbyId = lobby.id;
    socket.leave('lobbies');

    this.lobbyService.addLobby(lobby);
    socket.emit('create-lobby-response', lobby.id);
    this.server.to('lobbies').emit('lobby-created', lobby.toJSON());
  }

  @SubscribeMessage('join-lobby')
  public joinLobby(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() { username, lobbyId }: any,
  ): void {
    const player = new Player(username, socket.id);

    const lobby = this.lobbyService.getLobby(lobbyId);
    const hasJoinedLobby = lobby?.addPlayer(player);

    if (hasJoinedLobby) {
      socket.lobbyId = lobby.id;

      socket.leave('lobbies');
      socket.emit('join-lobby-response', lobby.id);

      socket.join(lobby.id);
      socket.to(lobby.id).emit('player-joined', { player: player.username });
    } else {
      socket.emit('join-lobby-response', { error: 'Failed to join lobby' });
    }
  }

  @SubscribeMessage('get-lobbies')
  public getLobbies(@ConnectedSocket() socket: Socket): void {
    const lobbies = this.lobbyService.lobbies.map((lobby) => lobby.toJSON());
    socket.emit('get-lobbies-response', lobbies);
  }

  @SubscribeMessage('get-lobby')
  public getLobby(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { lobbyId }: any,
  ): void {
    const lobby = this.lobbyService.getLobby(lobbyId);
    socket.emit('get-lobby-response', lobby.toJSON());
  }
}
