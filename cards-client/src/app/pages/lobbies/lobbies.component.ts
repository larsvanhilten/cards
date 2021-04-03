import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cards-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.scss'],
})
export class LobbiesComponent {
  constructor(private router: Router) {}

  public toLobbyCreation(): void {
    this.router.navigate(['/lobby']);
  }
}
