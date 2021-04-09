import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LobbyListComponent } from './components/lobby-list/lobby-list.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [LobbyListComponent, PlayerCardComponent],
  exports: [LobbyListComponent, PlayerCardComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
