import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbySummary } from '@models/lobby-summary';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';

@Component({
  selector: 'cards-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  public lobby!: LobbySummary;

  private subscriptions = new Subscription();

  constructor(private route: ActivatedRoute, private router: Router, private lobbyService: LobbyService) {}

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

    const playerJoinSubscription = this.lobbyService
      .onPlayerJoined()
      .subscribe((username) => (this.lobby.players = [...this.lobby.players, username]));
    this.subscriptions.add(playerJoinSubscription);

    const playerLeftSubscription = this.lobbyService
      .onPlayerLeft()
      .subscribe((username) => (this.lobby.players = this.lobby.players.filter((player) => player !== username)));
    this.subscriptions.add(playerLeftSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.lobbyService.leaveLobby();
  }
}
