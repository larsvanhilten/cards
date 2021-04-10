import { Injectable, NgModule } from '@angular/core';
import { CanActivate, Router, RouterModule, Routes } from '@angular/router';
import { LobbiesComponent } from './pages/lobbies/lobbies.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { OhHellComponent } from './pages/oh-hell/oh-hell.component';
import { UsernameComponent } from './pages/username/username.component';
import { SocketService } from './shared/services/socket/socket.service';

@Injectable({ providedIn: 'root' })
class SocketGuard implements CanActivate {
  constructor(private socketService: SocketService, private router: Router) {}

  public canActivate(): boolean {
    const { isConnected } = this.socketService;
    if (isConnected) {
      return true;
    }

    this.router.navigate(['username']);
    return false;
  }
}

const routes: Routes = [
  { path: 'username', component: UsernameComponent },
  { path: 'lobbies', component: LobbiesComponent, canActivate: [SocketGuard] },
  { path: 'lobbies/:id', component: LobbyComponent, canActivate: [SocketGuard] },
  { path: 'oh-hell/:id', component: OhHellComponent, canActivate: [SocketGuard] },
  { path: '**', redirectTo: 'username' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
