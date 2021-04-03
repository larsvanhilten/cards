import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbiesComponent } from './pages/lobbies/lobbies.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { UsernameComponent } from './pages/username/username.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  declarations: [AppComponent, UsernameComponent, LobbiesComponent, LobbyComponent],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
