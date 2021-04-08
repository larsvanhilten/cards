export interface Card {
  suit: Suit;
  rank: Rank;
}

export enum Rank {
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
  ACE,
}

export enum Suit {
  CLUB = 'CLUB',
  HEART = 'HEART',
  SPADE = 'SPADE',
  DIAMOND = 'DIAMOND',
}
