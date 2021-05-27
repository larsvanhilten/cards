import { Card } from "../card";

export interface CardPlayed {
  card: Card;
  isLast: boolean;
  isFinal: boolean;
}
