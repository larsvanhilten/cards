import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.scss'],
})
export class LobbyListComponent {
  @Input() public lobbies: any[] = [];
  @Output() public onLobbyClick = new EventEmitter<any>();

  public lobbyClick(lobby: any): void {
    this.onLobbyClick.emit(lobby);
  }
}
