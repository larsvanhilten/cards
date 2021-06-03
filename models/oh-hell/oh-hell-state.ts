import { Card } from "../card";
import { PlayerInfo } from "../player-info";
import { Score } from "./score";

export interface OhHellState {
  trump: Card;
  hand: Card[];
  playedCards: Card[];
  round: number;
  scores: [number, Score[]][];
  turn: PlayerInfo;
  shouldBid: boolean;
  illegalBid: number;
}
