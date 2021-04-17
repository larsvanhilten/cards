import { Card } from "../card";

export interface RoundInfo {
  hand: Card[];
  trump: Card;
  round: number;
}
