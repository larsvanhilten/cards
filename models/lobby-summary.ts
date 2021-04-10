import { Player } from "./player";
export interface LobbySummary {
  id: string;
  host: Player;
  players: Player[];
}
