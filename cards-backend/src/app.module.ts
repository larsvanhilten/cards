import { Module } from '@nestjs/common';
import { LobbyGateway } from './gateways/lobby.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [LobbyGateway],
})
export class AppModule {}
