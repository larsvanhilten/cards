import { Component, Input } from '@angular/core';
import { Player } from '@models/player';

@Component({
  selector: 'player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent {
  @Input() public player!: Player;
  @Input() public isHost = false;
}
