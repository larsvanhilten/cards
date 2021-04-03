import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class LobbyGateway {
  constructor() {
    console.log('started');
  }

  @SubscribeMessage('create')
  public findAll(): // @MessageBody() _: any,
  // @ConnectedSocket() _: Socket,
  void {
    console.log('received some');
  }
}
