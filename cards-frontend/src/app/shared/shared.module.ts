import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CountdownButtonComponent } from './components/countdown-button/countdown-button.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { FlippableCardComponent } from './components/flippable-card/flippable-card.component';
import { IconComponent } from './components/icon/icon.component';
import { LobbyListComponent } from './components/lobby-list/lobby-list.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { ScoreboardOverlayComponent } from './components/scoreboard-overlay/scoreboard-overlay.component';
import { VerticalRevolverComponent } from './components/vertical-revolver/vertical-revolver.component';

@NgModule({
  imports: [CommonModule, RouterModule, BrowserAnimationsModule],
  declarations: [
    LobbyListComponent,
    PlayerCardComponent,
    VerticalRevolverComponent,
    FlippableCardComponent,
    BottomBarComponent,
    IconComponent,
    ScoreboardOverlayComponent,
    CountdownButtonComponent,
    CustomButtonComponent,
    ConfirmDialogComponent,
  ],
  exports: [
    LobbyListComponent,
    PlayerCardComponent,
    VerticalRevolverComponent,
    FlippableCardComponent,
    BottomBarComponent,
    IconComponent,
    ScoreboardOverlayComponent,
    CountdownButtonComponent,
    CustomButtonComponent,
    ConfirmDialogComponent,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
