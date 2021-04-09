import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LobbySummary } from '@models/lobby-summary';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';

@Component({
  selector: 'cards-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.scss'],
})
export class LobbiesComponent implements OnInit, OnDestroy {
  public lobbies: LobbySummary[] = [];

  private subscriptions = new Subscription();

  constructor(private router: Router, private lobbyService: LobbyService) {}

  public ngOnInit(): void {
    const lobbyCreatedSubscription = this.lobbyService.onLobbyCreated().subscribe((lobby) => this.onLobbyCreated(lobby));
    this.subscriptions.add(lobbyCreatedSubscription);

    const lobbyRemovedSubscription = this.lobbyService.onLobbyRemoved().subscribe((lobbyId) => this.onLobbyRemoved(lobbyId));
    this.subscriptions.add(lobbyRemovedSubscription);

    this.lobbyService
      .getLobbies()
      .pipe(take(1))
      .subscribe((lobbies) => (this.lobbies = lobbies));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public joinLobby(lobby: LobbySummary): void {
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

  private onLobbyCreated(lobby: LobbySummary): void {
    this.lobbies = [...this.lobbies, lobby];
  }

  private onLobbyRemoved(lobbyId: string): void {
    this.lobbies = this.lobbies.filter((lobby) => lobby.id !== lobbyId);
  }
}
