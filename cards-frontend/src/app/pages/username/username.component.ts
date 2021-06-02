import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { SocketService } from 'src/app/shared/services/socket/socket.service';
@Component({
  selector: 'cards-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
})
export class UsernameComponent implements OnInit, OnDestroy {
  public error = '';
  private username = '';
  private isOnline = navigator.onLine;
  private subscriptions = new Subscription();

  constructor(private router: Router, private socketService: SocketService) {}

  public ngOnInit(): void {
    const offlineSubscription = fromEvent(window, 'offline').subscribe(() => (this.isOnline = false));
    this.subscriptions.add(offlineSubscription);

    const onlineSubscription = fromEvent(window, 'online').subscribe(() => (this.isOnline = true));
    this.subscriptions.add(onlineSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onUsernameChange(username: string): void {
    this.username = username;
  }

  public continue(username: string): void {
    const publicId = localStorage.getItem('publicId') || this.generateId();
    const privateId = localStorage.getItem('privateId') || this.generateId();

    this.socketService
      .connect(username, publicId, privateId)
      .pipe(
        tap(() => localStorage.setItem('publicId', publicId)),
        tap(() => localStorage.setItem('privateId', privateId)),
        take(1)
      )
      .subscribe(() => this.router.navigate(['lobbies']));
  }

  public canContinue = (): boolean => {
    if (!this.isOnline) {
      this.error = 'You are offline';
      return false;
    }

    const isUsernameValid = this.username.trim().length > 1 && this.username.trim().length < 10;
    if (!isUsernameValid) {
      this.error = 'Invalid username';
      return false;
    }

    this.error = '';
    return true;
  };

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
