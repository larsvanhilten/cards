import { Card } from '@models/card';
import { Score } from '@models/oh-hell/score';
import { Player } from '@models/player';
import { Deck } from './deck';
import { Game } from './game';
import { Lobby } from './lobby';

export class OhHell extends Game {
  public round = -1;
  public trump: Card;
  public deck = new Deck();

  private turnIndex = -1;
  private turnCount = -1;

  private playedCardMap = new Map<string, Card>();
  private handMap = new Map<string, Card[]>();
  private bidMaps: Map<string, number>[] = [];
  private trickMaps: Map<string, number>[] = [];

  constructor(lobby: Lobby) {
    super(lobby);
  }

  public setHand(playerId: string, cards: Card[]): void {
    this.handMap.set(playerId, cards).values();
  }

  public setBid(playerId: string, bid: number): void {
    const bidMap = this.bidMaps[this.round];
    if (bidMap) {
      bidMap.set(playerId, bid);
    } else {
      this.bidMaps[this.round] = new Map([[playerId, bid]]);
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

  public getScores(): Score[] {
    return this.players.map((player) => {
      const { socketId } = player;
      const bids = this.bidMaps[this.bidMaps.length - 1]?.get(socketId);
      const tricks = this.trickMaps[this.trickMaps.length - 1]?.get(socketId) || 0;

      return { player, bids, tricks };
    });
  }

  public setCardPlayed(playerId: string, card: Card): void {
    const playerHand = this.handMap.get(playerId);
    const handWithoutPlayedCard = playerHand.filter((c) => c.suit !== card.suit || c.rank !== card.rank);

    this.handMap.set(playerId, handWithoutPlayedCard);
    this.playedCardMap.set(playerId, card);
  }

  public setPlayerTurn(player: Player): void {
    this.turnIndex = this.players.findIndex((p) => p.socketId === player.socketId);
  }

  public getPlayerForTurn(): Player {
    const turn = (this.turnIndex + this.turnCount) % this.playerMap.size;
    return this.players[turn];
  }

  public nextTurn(): void {
    this.turnCount++;
  }

  public resetTurn(): void {
    this.playedCardMap.clear();
    this.turnCount = -1;
  }

  public getRoundWinner(): Player {
    const keys = [...this.playedCardMap.keys()];

    const winningKey = keys.reduce((acc, key) => {
      const winningCard = this.playedCardMap.get(acc);
      const card = this.playedCardMap.get(key);

      if (winningCard.suit !== this.trump.suit && card.suit === this.trump.suit) {
        return key;
      }

      if (card.suit === winningCard.suit && card.rank > winningCard.rank) {
        return key;
      }

      return acc;
    }, keys[this.turnIndex % this.playerMap.size]);

    return this.playerMap.get(winningKey);
  }

  public nextRound(): void {
    this.round++;
    this.turnIndex = this.round;
  }

  public get isLastHandEmpty(): boolean {
    const length = this.playerMap.size;
    const lastHandIndex = (this.turnIndex + length - 1) % length;
    const lastPlayerKey = this.players[lastHandIndex].socketId;
    return this.handMap.get(lastPlayerKey).length === 0;
  }

  public get isLastTurn(): boolean {
    return this.turnCount === this.playerMap.size - 1;
  }

  public get isLastRound(): boolean {
    return this.round + 1 === this.roundsToPlay * 2 - 1;
  }

  public get amountOfCardsToGive(): number {
    const cards = this.round + 1;
    const isOnWayDown = cards > this.roundsToPlay;
    return isOnWayDown ? this.roundsToPlay * 2 - cards : cards;
  }

  public isValidBid(bidToPlace: number): boolean {
    if (bidToPlace < 0) {
      return false;
    }

    const bids = [...this.bidMaps[this.round]?.values()];
    const sum = bids.reduce((acc, bid) => acc + bid, 0) + bidToPlace;
    return sum !== this.amountOfCardsToGive;
  }

  public getIllegalBid(): number {
    const bids = [...this.bidMaps[this.round]?.values()];
    const sum = bids.reduce((acc, bid) => acc + bid, 0);
    return this.amountOfCardsToGive - sum;
  }

  public hasCard(playerId: string, card: Card): boolean {
    return this.handMap.get(playerId).some((c) => c.rank === card.rank && c.suit === card.suit);
  }

  public isValidPlay(playerId: string, card: Card): boolean {
    const firstPlayer = this.players[this.turnIndex % this.playerMap.size];
    const firstCard = this.playedCardMap.get(firstPlayer.socketId);
    if (!firstCard) {
      return true;
    }

    const hand = this.handMap.get(playerId);
    const sameSuitCard = hand.find((c) => c.suit === firstCard.suit);
    if (!sameSuitCard) {
      return true;
    }

    return sameSuitCard.suit === card.suit;
  }

  public get hasStarted(): boolean {
    return this.round !== -1 && this.turnCount !== -1;
  }

  public get roundsToPlay(): number {
    return 2;
    // return Math.min(Math.floor(52 / this.playerMap.size), 10);
  }

  public static canStart(lobby: Lobby): boolean {
    return lobby.players.length > 2;
  }
}
