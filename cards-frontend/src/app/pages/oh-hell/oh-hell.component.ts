import { Component, OnDestroy, OnInit } from '@angular/core';
import { Card } from '@models/card';
import { OhHellTurn } from '@models/oh-hell-turn';
import { Subscription } from 'rxjs';
import { OhHellService } from 'src/app/shared/services/oh-hell/oh-hell.service';

@Component({
  selector: 'cards-oh-hell',
  templateUrl: './oh-hell.component.html',
  styleUrls: ['./oh-hell.component.scss'],
})
export class OhHellComponent implements OnInit, OnDestroy {
  public trump!: Card;
  public hand: Card[] = [];
  public turn!: OhHellTurn;

  private subscriptions = new Subscription();
  constructor(private ohHellService: OhHellService) {}

  public ngOnInit(): void {
    const roundInfoSubscription = this.ohHellService.onRoundInfo().subscribe(({ hand, trump }) => {
      this.hand = hand;
      this.trump = trump;
    });
    this.subscriptions.add(roundInfoSubscription);

    const turnSubscription = this.ohHellService.onTurn().subscribe((turn) => (this.turn = turn));
    this.subscriptions.add(turnSubscription);

    this.ohHellService.ready();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
