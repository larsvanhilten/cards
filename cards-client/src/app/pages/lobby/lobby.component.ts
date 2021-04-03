import { Component } from '@angular/core';

@Component({
  selector: 'cards-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  public players = [{ username: 'me' }, { username: 'bob' }];
}
