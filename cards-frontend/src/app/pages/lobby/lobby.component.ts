import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyInfo } from '@models/lobby-info';
import { Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { PUBLIC_ID } from 'src/app/app.module';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';

@Component({
  selector: 'cards-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  public lobby!: LobbyInfo;
  public error = '';

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lobbyService: LobbyService,
    @Inject(PUBLIC_ID) private publicId: string
  ) {}

  public ngOnInit(): void {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    if (lobbyId) {
      this.lobbyService
        .getLobby(lobbyId)
        .pipe(
          take(1),
          tap((lobby) => (this.lobby = lobby)),
          filter((lobby) => !lobby)
        )
        .subscribe(() => this.router.navigate(['lobbies']));
    } else {
      this.router.navigate(['lobbies']);
    }

    const startSubscription = this.lobbyService.onLobbyStarting().subscribe((gameType) => this.router.navigate([gameType, lobbyId]));
    this.subscriptions.add(startSubscription);

    const playerJoinSubscription = this.lobbyService
      .onPlayerJoined()
      .subscribe((player) => (this.lobby.players = [...this.lobby.players, player]));
    this.subscriptions.add(playerJoinSubscription);

    const playerLeftSubscription = this.lobbyService
      .onPlayerLeft()
      .subscribe((player) => (this.lobby.players = this.lobby.players.filter((p) => p.publicId !== player.publicId)));
    this.subscriptions.add(playerLeftSubscription);

    const hostChangeSubscription = this.lobbyService.onHostChanged().subscribe((host) => (this.lobby.host = host));
    this.subscriptions.add(hostChangeSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.lobbyService.leaveLobby();
  }

  public back(): void {
    this.router.navigate(['lobbies']);
  }

  public start(): void {
    this.lobbyService.startLobby();
  }

  public canStart = (): boolean => {
    const hasEnoughPlayers = this.lobby.players.length >= 3;
    if (!hasEnoughPlayers) {
      this.error = 'Not enough players';
      return false;
    }

    this.error = '';
    return true;
  };

  public get isHost(): boolean {
    console.log(this.lobby);
    console.log(this.publicId);
    return this.lobby?.host?.publicId === this.publicId;
  }
}
