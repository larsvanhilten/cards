import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyInfo } from '@models/lobby-info';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';
import { SocketService } from 'src/app/shared/services/socket/socket.service';

@Component({
  selector: 'cards-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.scss'],
})
export class LobbiesComponent implements OnInit, OnDestroy {
  public lobbies: LobbyInfo[] = [];

  private subscriptions = new Subscription();

  constructor(private router: Router, private socketService: SocketService, private lobbyService: LobbyService) {}

  public ngOnInit(): void {
    const lobbyCreatedSubscription = this.lobbyService.onLobbyCreated().subscribe((lobby) => this.onLobbyCreated(lobby));
    this.subscriptions.add(lobbyCreatedSubscription);

    const lobbyRemovedSubscription = this.lobbyService.onLobbyRemoved().subscribe((lobbyId) => this.onLobbyRemoved(lobbyId));
    this.subscriptions.add(lobbyRemovedSubscription);

    const reconnectionSubscription = this.socketService.onReconnect().subscribe(() => this.getLobbies());
    this.subscriptions.add(reconnectionSubscription);

    this.getLobbies();
  }

  public getLobbies(): void {
    this.lobbyService
      .getLobbies()
      .pipe(take(1))
      .subscribe((lobbies) => (this.lobbies = lobbies));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public back(): void {
    this.router.navigate(['username']);
  }

  public joinLobby(lobby: LobbyInfo): void {
    this.lobbyService
      .joinLobby(lobby.id)
      .pipe(take(1))
      .subscribe((lobbyId) => this.router.navigate(['lobbies', lobbyId]));
  }

  public createLobby(): void {
    this.lobbyService
      .createLobby()
      .pipe(
        take(1),
        filter((lobbyId) => !!lobbyId)
      )
      .subscribe((lobbyId) => this.router.navigate(['lobbies', lobbyId]));
  }

  private onLobbyCreated(lobby: LobbyInfo): void {
    this.lobbies = [...this.lobbies, lobby];
  }

  private onLobbyRemoved(lobbyId: string): void {
    this.lobbies = this.lobbies.filter((lobby) => lobby.id !== lobbyId);
  }
}
