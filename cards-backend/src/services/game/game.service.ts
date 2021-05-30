import { Injectable } from '@nestjs/common';
import { Game } from 'src/interfaces/game';

@Injectable()
export class GameService {
  private gameMap = new Map<string, Game>();

  public addGame(game: Game): void {
    this.gameMap.set(game.id, game);
  }

  public removeGame(game: Game): void {
    this.gameMap.delete(game.id);
  }

  public get games(): Game[] {
    return [...this.gameMap.values()];
  }

  public getGame(lobbyId: string): Game {
    return this.gameMap.get(lobbyId);
  }

  public findGameForPlayerId(playerId: string): Game {
    return this.games.find((lobby) => lobby.hasPlayer(playerId));
  }

  
}
