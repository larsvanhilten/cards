import { PlayerInfo } from "../player-info";

export interface Turn {
  player: PlayerInfo;
  shouldBid: boolean;
  illegalBid: number;
}
