import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cards-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
})
export class UsernameComponent {
  constructor(private router: Router) {}

  public continue(username: string): void {
    if (username.trim().length > 1) {
      this.router.navigate(['/lobbies'], { queryParams: { username } });
    }
  }
}
