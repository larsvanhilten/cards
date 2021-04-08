import { Module } from '@nestjs/common';
import { LobbyGateway } from './gateways/lobby.gateway';
import { OhHellGateway } from './gateways/oh-hell.gateway';
import { GameService } from './services/game/game.service';
import { LobbyService } from './services/lobby/lobby.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LobbyGateway, OhHellGateway, LobbyService, GameService],
})
export class AppModule {}
