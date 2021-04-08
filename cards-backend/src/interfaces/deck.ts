import { Card, Rank, Suit } from './card';

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.generateCards();
    this.shuffle();
  }

  public draw(amountOfCards: number): Card[] {
    return this.cards.splice(0, amountOfCards);
  }

  public shuffle(): void {
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

  private generateCards(): void {
    const suits = Object.values(Suit);
    const ranks = Object.values(Rank);

    this.cards = suits.reduce((acc, suit) => {
      const cards = ranks.map((rank) => ({ suit, rank }));
      return [...acc, ...cards];
    }, []);
  }
}
