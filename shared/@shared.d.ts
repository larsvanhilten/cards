declare module "@shared" {
  export interface LobbySummary {
    id: string;
    host: string;
    players: string[];
  }

  export interface CreateLobbyPayload {
    username: string;
  }

  export interface JoinLobbyPayload {
    lobbyId: string;
    username: string;
  }

  export interface GetLobbyPayload {
    lobbyId: string;
  }
}
