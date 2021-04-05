import { Injectable } from '@nestjs/common';
import { Lobby } from 'src/interfaces/lobby';
import { LobbyMap } from 'src/interfaces/lobby-map';

@Injectable()
export class LobbyService {
  private lobbyMap: LobbyMap = {};

  public addLobby(lobby: Lobby): void {
    this.lobbyMap[lobby.id] = lobby;
  }

  public removeLobby(lobby: Lobby): void {
    delete this.lobbyMap[lobby.id];
  }

  public get lobbies(): Lobby[] {
    return Object.values(this.lobbyMap);
  }

  public getLobby(lobbyId: string): Lobby {
    return this.lobbyMap[lobbyId];
  }

  public findLobbyForPlayerId(playerId: string): Lobby {
    return this.lobbies.find((lobby) => lobby.hasPlayer(playerId));
  }
}
