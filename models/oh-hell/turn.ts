import { PlayerInfo } from "../player-info";

export interface Turn {
  player: PlayerInfo;
  nextPlayer: PlayerInfo;
  shouldBid: boolean;
  illegalBid: number;
}
