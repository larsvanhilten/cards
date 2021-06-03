import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LobbyInfo } from '@models/lobby-info';

@Component({
  selector: 'lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.scss'],
})
export class LobbyListComponent {
  @Input() public lobbies: LobbyInfo[] = [];
  @Output() public onLobbyClick = new EventEmitter<LobbyInfo>();

  public lobbyClick(lobby: LobbyInfo): void {
    this.onLobbyClick.emit(lobby);
  }
}
