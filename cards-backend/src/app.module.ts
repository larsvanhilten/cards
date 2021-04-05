import { Module } from '@nestjs/common';
import { LobbyGateway } from './gateways/lobby.gateway';
import { LobbyService } from './services/lobby/lobby.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LobbyGateway, LobbyService],
})
export class AppModule {}
