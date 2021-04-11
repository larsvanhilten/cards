import { Player } from "../player";

export interface Score {
  player: Player;
  bids: number[];
  tricks: number[];
}
