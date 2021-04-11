import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FlippableCardComponent } from './components/flippable-card/flippable-card.component';
import { LobbyListComponent } from './components/lobby-list/lobby-list.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { VerticalRevolverComponent } from './components/vertical-revolver/vertical-revolver.component';

@NgModule({
  imports: [CommonModule, RouterModule, BrowserAnimationsModule],
  declarations: [LobbyListComponent, PlayerCardComponent, VerticalRevolverComponent, FlippableCardComponent],
  exports: [LobbyListComponent, PlayerCardComponent, VerticalRevolverComponent, FlippableCardComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
