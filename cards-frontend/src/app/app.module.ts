import { DragDropModule } from '@angular/cdk/drag-drop';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbiesComponent } from './pages/lobbies/lobbies.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { OhHellComponent } from './pages/oh-hell/oh-hell.component';
import { UsernameComponent } from './pages/username/username.component';
import { SharedModule } from './shared/shared.module';

export const PUBLIC_ID = new InjectionToken<string>('publicId');
export const PRIVATE_ID = new InjectionToken<string>('privateId');

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    DragDropModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  declarations: [AppComponent, UsernameComponent, LobbiesComponent, LobbyComponent, OhHellComponent],
  providers: [
    { provide: PUBLIC_ID, useValue: localStorage.getItem('publicId') },
    { provide: PRIVATE_ID, useValue: localStorage.getItem('privateId') },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
