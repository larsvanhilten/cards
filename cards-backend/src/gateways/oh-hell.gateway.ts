import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExtendedSocket } from 'src/interfaces/extended-socket';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class OhHellGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  public handleConnection(_: Socket): void {
    //
  }

  public handleDisconnect(_: ExtendedSocket): void {
    //
  }
}
