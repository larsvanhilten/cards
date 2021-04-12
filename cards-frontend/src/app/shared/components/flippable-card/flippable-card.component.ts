import { Component, Input } from '@angular/core';
import { Card } from '@models/card';

@Component({
  selector: 'flippable-card',
  templateUrl: './flippable-card.component.html',
  styleUrls: ['./flippable-card.component.scss'],
})
export class FlippableCardComponent {
  @Input() public card!: Card | null;
}
