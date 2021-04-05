import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SocketService } from 'src/app/shared/services/socket/socket.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'cards-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
})
export class UsernameComponent {
  constructor(private router: Router, private socketService: SocketService, private userService: UserService) {}

  public continue(username: string): void {
    if (username.trim().length > 1) {
      this.userService.username = username;

      this.socketService
        .connect()
        .pipe(take(1))
        .subscribe(() => this.router.navigate(['lobbies']));
    }
  }
}
