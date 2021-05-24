import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbySummary } from '@models/lobby-summary';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';
import { SocketService } from 'src/app/shared/services/socket/socket.service';

@Component({
  selector: 'cards-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  public lobby!: LobbySummary;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lobbyService: LobbyService,
    private socketService: SocketService
  ) {}

  public ngOnInit(): void {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    if (lobbyId) {
      this.lobbyService
        .getLobby(lobbyId)
        .pipe(take(1))
        .subscribe((lobby) => (this.lobby = lobby));
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
      .subscribe((player) => (this.lobby.players = this.lobby.players.filter((p) => p.socketId !== player.socketId)));
    this.subscriptions.add(playerLeftSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.lobbyService.leaveLobby();
  }

  public start(): void {
    this.lobbyService.startLobby();
  }

  public canStart = (): boolean => {
    return this.lobby.players.length >= 3;
  };

  public get isHost(): boolean {
    return this.lobby?.host?.socketId === this.socketService.id;
  }
}
