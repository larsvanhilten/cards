import { Card } from '@models/card';
import { OhHellScore } from '@models/oh-hell-score';
import { Deck } from './deck';
import { Game } from './game';
import { Lobby } from './lobby';

export class OhHell extends Game {
  public roundsToPlay: number;
  public round = 0;
  public turn = 0;
  public trump: Card;
  public deck = new Deck();

  private playedCardMap = new Map<string, Card>();
  private handMap = new Map<string, Card[]>();
  private bidMaps: Map<string, number>[] = [];
  private trickMaps: Map<string, number>[] = [];

  constructor(lobby: Lobby) {
    super(lobby);

    this.roundsToPlay = this.getRoundsToPlay(lobby.players.length);
  }

  public setHand(playerId: string, cards: Card[]): void {
    this.handMap.set(playerId, cards).values();
  }

  public setBid(playerId: string, bid: number): void {
    const bidMap = this.bidMaps[this.round];
    if (bidMap) {
      bidMap.set(playerId, bid);
    } else {
      this.trickMaps[this.round] = new Map([[playerId, bid]]);
    }
  }

  public addTrickWon(playerId: string): void {
    const trickMap = this.trickMaps[this.round];
    if (trickMap) {
      const trick = trickMap.get(playerId);
      trickMap.set(playerId, trick + 1);
    } else {
      this.trickMaps[this.round] = new Map([[playerId, 1]]);
    }
  }

  public get scores(): OhHellScore[] {
    return this.players.map(({ socketId: playerId }) => {
      const bids = this.bidMaps.map((bidMap) => bidMap.get(playerId));
      const tricks = this.trickMaps.map((trickMap) => trickMap.get(playerId));

      return { playerId, bids, tricks };
    });
  }

  // // TODO: support draws
  // public getWinner(): Player {
  //   const { playerId } = this.scores.reduce(
  //     (acc, { playerId, bids, tricks }) => {
  //       const score = bids.reduce((bcc, bid, index) => {
  //         const trick = tricks[index];
  //         if (bid === trick) {
  //           return bcc + 10 + trick * 1;
  //         }
  //         return acc;
  //       }, 0);

  //       if (score > acc) {
  //         return { playerId, score };
  //       }

  //       return acc;
  //     },
  //     { playerId: null, score: -1 }
  //   );

  //   return this.playerMap.get(playerId);
  // }

  public setCardPlayed(playerId: string, card: Card): void {
    this.playedCardMap.set(playerId, card);
  }

  public getPlayerIdForTurn(): string {
    return this.players[this.turn].socketId;
  }

  public nextTurn(): void {
    if (this.turn === this.playerMap.size - 1) {
      this.turn = 0;
    } else {
      this.turn += 1;
    }
  }

  public getRoundWinner(): string {
    const keys = [...this.playedCardMap.keys()];

    const winningKey = keys.reduce((acc, key) => {
      const winningCard = this.playedCardMap.get(acc);
      const card = this.playedCardMap.get(key);
      if (winningCard.suit === this.trump.suit && card.suit !== this.trump.suit) {
        return acc;
      }

      if (card.suit === winningCard.suit && card.rank > winningCard.rank) {
        return key;
      }

      return acc;
    }, keys[0]);

    return winningKey;
  }

  public nextRound(): void {
    this.round++;
  }

  public get isLastTurn(): boolean {
    return this.turn === this.playerMap.size - 1;
  }

  public get isLastRound(): boolean {
    return this.round === this.roundsToPlay * 2 - 1;
  }

  private getRoundsToPlay(amountOfPlayers: number): number {
    return Math.floor(52 / amountOfPlayers);
  }

  public static canStart(lobby: Lobby): boolean {
    return lobby.players.length > 2;
  }
}
