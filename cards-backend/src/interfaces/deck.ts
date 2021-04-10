import { Card, Rank, Suit } from '@models/card';

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.shuffle();
  }

  public getCards(amountOfCards: number): Card[] {
    return this.cards.splice(this.cards.length - amountOfCards, amountOfCards);
  }

  public draw(): Card {
    return this.cards.pop();
  }

  public shuffle(): void {
    this.reset();

    let currentIndex = this.cards.length,
      temporaryValue: Card,
      randomIndex: number;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  private reset(): void {
    const suits = Object.keys(Suit);
    const ranks = Object.keys(Rank)
      .map((key) => parseInt(key, 10))
      .filter((key) => key >= 0);

    this.cards = suits.reduce((acc, suit) => {
      const cards = ranks.map((rank) => ({ suit, rank }));
      return [...acc, ...cards];
    }, []);
  }
}
