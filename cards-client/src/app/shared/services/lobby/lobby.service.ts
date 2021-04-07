import { Injectable } from '@angular/core';
import { LobbySummary } from '@shared';
import { concat, Observable, of } from 'rxjs';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  constructor(private socketService: SocketService) {}

  public getLobbies(): Observable<LobbySummary[]> {
    const { on, emit } = this.socketService;
    return concat(on('get-lobbies-response'), of(emit('get-lobbies')));
  }

  public onLobbyCreated(): Observable<LobbySummary> {
    return this.socketService.on('lobby-created');
  }

  public onLobbyRemoved(): Observable<string> {
    return this.socketService.on('lobby-removed');
  }

  public joinLobby(lobbyId: string, username: string): Observable<string> {
    const { on, emit } = this.socketService;
    return concat(on('join-lobby-response'), of(emit('join-lobby', { lobbyId, username })));
  }

  public createLobby(username: string): Observable<string> {
    const { on, emit } = this.socketService;
    return concat(on('create-lobby-response'), of(emit('create-lobby', { username })));
  }

  public getLobby(lobbyId: string): Observable<LobbySummary> {
    const { on, emit } = this.socketService;
    return concat(on('get-lobby-response'), of(emit('get-lobby', { lobbyId })));
  }

  public onPlayerJoined(): Observable<string> {
    return this.socketService.on('player-joined');
  }

  public onPlayerLeft(): Observable<string> {
    return this.socketService.on('player-left');
  }
}
