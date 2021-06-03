import { PlayerInfo } from "../player-info";

export interface Bid {
  player: PlayerInfo;
  bid: number;
  isLast: boolean;
}
