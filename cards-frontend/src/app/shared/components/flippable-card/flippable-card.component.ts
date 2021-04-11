import { AfterViewInit, Component, Input } from '@angular/core';
import { Card } from '@models/card';

@Component({
  selector: 'flippable-card',
  templateUrl: './flippable-card.component.html',
  styleUrls: ['./flippable-card.component.scss'],
})
export class FlippableCardComponent implements AfterViewInit {
  @Input() public card!: Card;
  public flip = false;

  public ngAfterViewInit(): void {
    window.setTimeout(() => (this.flip = true), 0);
  }
}
