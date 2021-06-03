import { PlayerInfo } from "./player-info";

export interface LobbyInfo {
  id: string;
  host: PlayerInfo;
  players: PlayerInfo[];
}
