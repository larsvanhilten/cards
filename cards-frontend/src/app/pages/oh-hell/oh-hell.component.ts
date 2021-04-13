import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Card } from '@models/card';
import { Bid } from '@models/oh-hell/bid';
import { RoundInfo } from '@models/oh-hell/round-info';
import { Turn } from '@models/oh-hell/turn';
import { Subscription } from 'rxjs';
import { VerticalRevolverComponent } from 'src/app/shared/components/vertical-revolver/vertical-revolver.component';
import { OhHellService } from 'src/app/shared/services/oh-hell/oh-hell.service';
import { cardMovementAnimation } from './animation';

@Component({
  selector: 'cards-oh-hell',
  templateUrl: './oh-hell.component.html',
  styleUrls: ['./oh-hell.component.scss'],
  animations: [cardMovementAnimation],
})
export class OhHellComponent implements OnInit, OnDestroy {
  @ViewChild(VerticalRevolverComponent)
  private playerRevolver!: VerticalRevolverComponent;

  public trump!: Card;
  public hand: Card[] = [];
  public isMyTurn = false;
  public shouldBid = false;
  public bidOptions: number[] = [];

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

    this.ohHellService.ready();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

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
    if (isLast) {
      this.playedCards = [];
    }
  };

  private onRoundInfo = (roundInfo: RoundInfo): void => {
    this.hand = roundInfo.hand;
    this.trump = roundInfo.trump;
  };

  private onTurn = (turn: Turn): void => {
    const { player, nextPlayer, shouldBid } = turn;

    this.isMyTurn = player.socketId === this.ohHellService.id;
    this.shouldBid = shouldBid;

    if (this.playerRevolver.isEmpty) {
      this.playerRevolver.add(player.username, nextPlayer.username);
    } else {
      this.playerRevolver.add(nextPlayer.username);
    }

    if (this.isMyTurn && this.shouldBid) {
      this.bidOptions = this.getBidOptions();
    }
  };

  private onCardPlayed = (card: Card) => {
    this.cardPlayed = card;
  };

  public addCardToStack(): void {
    if (this.cardPlayed) {
      this.playedCards.push(Object.assign({}, this.cardPlayed));
      this.cardPlayed = null;
    }
  }

  private getBidOptions(): number[] {
    return [0, ...this.hand.map((_, i) => i + 1)];
  }
}
