import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket/socket.service';

@Component({
  selector: 'cards-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
})
export class UsernameComponent {
  constructor(private router: Router, private socketService: SocketService) {}

  public continue(username: string): void {
    if (username.trim().length > 1) {
      this.socketService.start();
      this.router.navigate(['/lobbies'], { queryParams: { username } });
    }
  }
}
