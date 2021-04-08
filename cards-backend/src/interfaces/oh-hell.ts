import { Card } from './card';
import { Deck } from './deck';
import { Game } from './game';
import { Lobby } from './lobby';

export class OhHell extends Game {
  public roundsToPlay: number;
  public round = 0;
  public trump: Card;

  private deck = new Deck();
  private playedCardMap = new Map<string, Card>();
  private handMap = new Map<string, Card[]>();
  private bidMap: Map<string, number>[] = [];
  private trickMap: Map<string, number>[] = [];

  constructor(lobby: Lobby) {
    super(lobby);

    this.roundsToPlay = this.calculateRoundsToPlay(lobby.players.length);
  }

  private calculateRoundsToPlay(amountOfPlayers: number): number {
    return Math.floor(52 / amountOfPlayers);
  }

  public static canStart(lobby: Lobby): boolean {
    return lobby.players.length > 2;
  }
}
