import { Player } from "../player";

export interface Turn {
  player: Player;
  nextPlayer: Player;
  shouldBid: boolean;
  illegalBid: number;
}
