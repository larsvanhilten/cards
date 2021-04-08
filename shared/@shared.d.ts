declare module "@shared" {
  export interface LobbySummary {
    id: string;
    host: string;
    players: string[];
  }

  export interface JoinLobbyPayload {
    lobbyId: string;
  }

  export interface GetLobbyPayload {
    lobbyId: string;
  }
}
