import { Component, Input } from '@angular/core';

@Component({
  selector: 'lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.scss'],
})
export class LobbyListComponent {
  @Input() public lobbies: any[] = [{}, {}];
}
