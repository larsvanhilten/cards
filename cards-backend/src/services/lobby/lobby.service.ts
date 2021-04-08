import { Injectable } from '@nestjs/common';
import { Lobby } from 'src/interfaces/lobby';

@Injectable()
export class LobbyService {
  private lobbyMap = new Map<string, Lobby>();

  public addLobby(lobby: Lobby): void {
    this.lobbyMap.set(lobby.id, lobby);
  }

  public removeLobby(lobby: Lobby): void {
    this.lobbyMap.delete(lobby.id);
  }

  public get lobbies(): Lobby[] {
    return [...this.lobbyMap.values()];
  }

  public getLobby(lobbyId: string): Lobby {
    return this.lobbyMap.get(lobbyId);
  }

  public findLobbyForPlayerId(playerId: string): Lobby {
    return this.lobbies.find((lobby) => lobby.hasPlayer(playerId));
  }
}
