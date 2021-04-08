import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LobbySummary } from '@models/lobby-summary';

@Component({
  selector: 'lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.scss'],
})
export class LobbyListComponent {
  @Input() public lobbies: LobbySummary[] = [];
  @Output() public onLobbyClick = new EventEmitter<LobbySummary>();

  public lobbyClick(lobby: LobbySummary): void {
    this.onLobbyClick.emit(lobby);
  }
}
