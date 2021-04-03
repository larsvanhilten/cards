import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbiesComponent } from './pages/lobbies/lobbies.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { UsernameComponent } from './pages/username/username.component';

const routes: Routes = [
  { path: 'username', component: UsernameComponent },
  { path: 'lobbies', component: LobbiesComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: '**', redirectTo: 'username' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
