import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExtendedSocket } from 'src/interfaces/extended-socket';
import { GameService } from 'src/services/game/game.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class OhHellGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(private gameService: GameService) {}

  public handleConnection(_: Socket): void {
    //
  }

  public handleDisconnect(_: ExtendedSocket): void {
    //
  }

  @SubscribeMessage('oh-hell/ready')
  public startLobby(@ConnectedSocket() socket: ExtendedSocket): void {
    const { lobbyId } = socket;
    const game = this.gameService.getGame(lobbyId);
    if (!game) {
      return;
    }

    game.setReady(socket.id);
    if (game.isAllReady) {
      // give hands and trump
      // give first bid turn
    }
  }
}
