import { PlayerInfo } from "../player-info";

export interface Score {
  player: PlayerInfo;
  bids: number;
  tricks: number;
}
