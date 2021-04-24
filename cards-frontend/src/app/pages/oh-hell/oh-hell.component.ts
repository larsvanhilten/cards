import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Card } from '@models/card';
import { Bid } from '@models/oh-hell/bid';
import { CardPlayed } from '@models/oh-hell/card-played';
import { GameInfo } from '@models/oh-hell/game-info';
import { RoundInfo } from '@models/oh-hell/round-info';
import { Turn } from '@models/oh-hell/turn';
import { Player } from '@models/player';
import { Subscription } from 'rxjs';
import { VerticalRevolverComponent } from 'src/app/shared/components/vertical-revolver/vertical-revolver.component';
import { OhHellService } from 'src/app/shared/services/oh-hell/oh-hell.service';
import { cardMovementAnimation, fadeAnimation, winnerFadeAnimation } from './animation';

@Component({
  selector: 'cards-oh-hell',
  templateUrl: './oh-hell.component.html',
  styleUrls: ['./oh-hell.component.scss'],
  animations: [cardMovementAnimation, fadeAnimation, winnerFadeAnimation],
})
export class OhHellComponent implements OnInit, OnDestroy {
  @ViewChild(VerticalRevolverComponent)
  private playerRevolver!: VerticalRevolverComponent;

  public round = 0;
  public players: Player[] = [];
  public trump!: Card;
  public hand: Card[] = [];
  public isMyTurn = false;
  public shouldBid = false;
  public bidOptions: number[] = [];
  public isLastTurn = false;
  public trickWinner: Player | null = null;

  public cardPlayed: Card | null = null;
  public playedCards: Card[] = [];

  private subscriptions = new Subscription();
  constructor(private ohHellService: OhHellService) {}

  public ngOnInit(): void {
    const roundInfoSubscription = this.ohHellService.onRoundInfo().subscribe(this.onRoundInfo);
    this.subscriptions.add(roundInfoSubscription);

    const turnSubscription = this.ohHellService.onTurn().subscribe(this.onTurn);
    this.subscriptions.add(turnSubscription);

    const cardPlayedSubscription = this.ohHellService.onCardPlayed().subscribe(this.onCardPlayed);
    this.subscriptions.add(cardPlayedSubscription);

    const bidPlacedSubscription = this.ohHellService.onBidPlaced().subscribe(this.onBidPlaced);
    this.subscriptions.add(bidPlacedSubscription);

    const gameInfoSubscription = this.ohHellService.onGameInfo().subscribe(this.onGameInfo);
    this.subscriptions.add(gameInfoSubscription);

    const roundWinnerSubscription = this.ohHellService.onRoundWinner().subscribe(this.onRoundWinner);
    this.subscriptions.add(roundWinnerSubscription);

    this.ohHellService.ready();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onGameInfo = (gameInfo: GameInfo): void => {
    this.players = gameInfo.players;
  };

  public placeBid(bid: number): void {
    if (this.isMyTurn) {
      this.ohHellService.placeBid(bid);
    }
  }

  public playCard(event: CdkDragDrop<Card[]>): void {
    if (event.isPointerOverContainer) {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.ohHellService.playCard(event.item.data);
    }
  }

  public canPlayCard = (): boolean => {
    return this.isMyTurn && !this.shouldBid && !this.cardPlayed;
  };

  private onBidPlaced = ({ isLast }: Bid): void => {
    this.playerRevolver.increment();
    if (isLast) {
      this.playedCards = [];
      this.playerRevolver.restartWith(this.currentPlayerForTurn);
    }
  };

  private get currentPlayerForTurn(): Player {
    return this.players[this.round % this.players.length];
  }

  private onRoundInfo = (roundInfo: RoundInfo): void => {
    this.hand = roundInfo.hand;
    this.trump = roundInfo.trump;
    this.round = roundInfo.round;

    this.playerRevolver.restartWith(this.currentPlayerForTurn);
  };

  private onTurn = (turn: Turn): void => {
    const { player, shouldBid } = turn;

    this.isMyTurn = player.socketId === this.ohHellService.id;
    this.shouldBid = shouldBid;

    if (this.isMyTurn && this.shouldBid) {
      this.bidOptions = this.getBidOptions();
    }
  };

  private onCardPlayed = (turnInfo: CardPlayed) => {
    this.cardPlayed = turnInfo.card;
    this.isLastTurn = turnInfo.isLast;
    this.playerRevolver.increment();
  };

  private onRoundWinner = (winner: Player) => {
    this.trickWinner = winner;
    this.playerRevolver.restartWith(winner);
  };

  public addCardToStack(): void {
    if (this.cardPlayed && this.isLastTurn) {
      this.playedCards = [];
      window.setTimeout(() => (this.cardPlayed = null), 2000);
    } else if (this.cardPlayed && !this.isLastTurn) {
      this.playedCards.push(Object.assign({}, this.cardPlayed));
      this.cardPlayed = null;
    }
  }

  private getBidOptions(): number[] {
    return [0, ...this.hand.map((_, i) => i + 1)];
  }
}
