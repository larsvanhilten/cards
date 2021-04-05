import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';

@Component({
  selector: 'cards-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  public lobby: any;

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
  }
}
