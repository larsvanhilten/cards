import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket/socket.service';

@Component({
  selector: 'cards-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.scss'],
})
export class LobbiesComponent {
  constructor(private router: Router, private socketService: SocketService) {}

  public toLobbyCreation(): void {
    this.socketService.create();
    this.router.navigate(['/lobby']);
  }
}
