import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SocketService } from 'src/app/shared/services/socket/socket.service';
@Component({
  selector: 'cards-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
})
export class UsernameComponent {
  private username = '';

  constructor(private router: Router, private socketService: SocketService) {}

  public onUsernameChange(username: string): void {
    this.username = username;
  }

  public continue(username: string): void {
    this.socketService
      .connect(username)
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['lobbies']));
  }

  public isValidUsername = (): boolean => {
    return this.username.trim().length > 1 && this.username.trim().length < 10;
  };
}
