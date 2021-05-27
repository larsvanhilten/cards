import { CdkDrag, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card, Suit } from '@models/card';
import { Bid } from '@models/oh-hell/bid';
import { CardPlayed } from '@models/oh-hell/card-played';
import { GameInfo } from '@models/oh-hell/game-info';
import { RoundInfo } from '@models/oh-hell/round-info';
import { Score } from '@models/oh-hell/score';
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

  public isFinished = false;
  public round = 0;
  public roundsToPlay!: number;
  public players: Player[] = [];
  public trump!: Card;
  public hand: Card[] = [];
  public isMyTurn = false;
  public shouldBid = true;
  public bidOptions: number[] = [];
  public isLastTurn = false;
  public trickWinner: Player | null = null;
  public showScoreboard = false;
  public roundToResultsMap: [number, Score[]][] = [];
  public showExitDialog = false;

  public cardPlayed: Card | null = null;
  public playedCards: Card[] = [];

  private subscriptions = new Subscription();
  constructor(private ohHellService: OhHellService, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    const gameInfoSubscription = this.ohHellService.onGameInfo().subscribe(this.onGameInfo);
    this.subscriptions.add(gameInfoSubscription);

    const roundInfoSubscription = this.ohHellService.onRoundInfo().subscribe(this.onRoundInfo);
    this.subscriptions.add(roundInfoSubscription);

    const turnSubscription = this.ohHellService.onTurn().subscribe(this.onTurn);
    this.subscriptions.add(turnSubscription);

    const cardPlayedSubscription = this.ohHellService.onCardPlayed().subscribe(this.onCardPlayed);
    this.subscriptions.add(cardPlayedSubscription);

    const bidPlacedSubscription = this.ohHellService.onBidPlaced().subscribe(this.onBidPlaced);
    this.subscriptions.add(bidPlacedSubscription);

    const roundWinnerSubscription = this.ohHellService.onRoundWinner().subscribe(this.onRoundWinner);
    this.subscriptions.add(roundWinnerSubscription);

    const scoreSubscription = this.ohHellService.onScores().subscribe(this.onScores);
    this.subscriptions.add(scoreSubscription);

    const finishSubscription = this.ohHellService.onFinished().subscribe(this.onFinished);
    this.subscriptions.add(finishSubscription);

    this.ohHellService.ready();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onGameInfo = (gameInfo: GameInfo): void => {
    this.players = gameInfo.players;
    this.roundsToPlay = gameInfo.roundsToPlay;
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

  public canPlayCard = (item: CdkDrag<Card>): boolean => {
    if (!this.isMyTurn || this.shouldBid || this.cardPlayed) {
      return false;
    }

    if (this.hasSuit(this.playedCards[0]?.suit) && item.data.suit !== this.playedCards[0]?.suit) {
      return false;
    }

    return true;
  };

  public hasSuit(suit: Suit): boolean {
    return this.hand.some((card) => card.suit === suit);
  }

  private onBidPlaced = ({ isLast, player, bid }: Bid): void => {
    this.playerRevolver.setBid(player.socketId, bid);
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
    const { player, shouldBid, illegalBid } = turn;

    this.isMyTurn = player.socketId === this.ohHellService.id;
    this.shouldBid = shouldBid;

    if (this.isMyTurn && this.shouldBid) {
      this.bidOptions = this.getBidOptions(illegalBid);
    }
  };

  private onCardPlayed = (turnInfo: CardPlayed) => {
    this.cardPlayed = turnInfo.card;
    this.isLastTurn = turnInfo.isLast;
    this.playerRevolver.increment();
  };

  private onRoundWinner = (winner: Player) => {
    this.trickWinner = winner;
    this.playerRevolver.incrementTricks(winner.socketId);
    this.playerRevolver.restartWith(winner);
  };

  private onScores = (scores: Score[]) => {
    this.roundToResultsMap.push([this.round, scores]);
  };

  private onFinished = (): void => {
    this.isFinished = true;
    window.setTimeout(() => (this.showScoreboard = true), 5000);
  };

  public addCardToStack(): void {
    if (this.cardPlayed && this.isLastTurn && !this.isFinished) {
      this.playedCards = [];
      window.setTimeout(() => (this.cardPlayed = null), 2000);
    } else if (this.cardPlayed && !this.isLastTurn) {
      this.playedCards.push(Object.assign({}, this.cardPlayed));
      this.cardPlayed = null;
    }
  }

  public onWinnerTitleShowed(): void {
    this.trickWinner = null;
    if (this.shouldBid) {
      this.playerRevolver.resetBids();
    }
  }

  public exit(): void {
    this.router.navigate(['lobbies']);
  }

  public backToLobby(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['lobbies', id]);
  }

  private getBidOptions(illegalBid: number): number[] {
    return [0, ...this.hand.map((_, i) => i + 1)].filter((bid) => bid !== illegalBid);
  }
}
