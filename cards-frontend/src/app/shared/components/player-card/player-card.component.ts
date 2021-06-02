import { Component, Input } from '@angular/core';
import { PlayerInfo } from '@models/player-info';

@Component({
  selector: 'player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent {
  @Input() public player!: PlayerInfo;
  @Input() public isHost = false;
}
