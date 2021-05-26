import { Injectable } from '@angular/core';
import { GameType } from '@models/game-type';
import { LobbySummary } from '@models/lobby-summary';
import { Player } from '@models/player';
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

  public onLobbyStarting(): Observable<GameType> {
    return this.socketService.on('lobby-starting');
  }

  public onLobbyRemoved(): Observable<string> {
    return this.socketService.on('lobby-removed');
  }

  public joinLobby(lobbyId: string): Observable<string> {
    const { on, emit } = this.socketService;
    return concat(on('join-lobby-response'), of(emit('join-lobby', lobbyId)));
  }

  public createLobby(): Observable<string> {
    const { on, emit } = this.socketService;
    return concat(on('create-lobby-response'), of(emit('create-lobby')));
  }

  public getLobby(lobbyId: string): Observable<LobbySummary> {
    const { on, emit } = this.socketService;
    return concat(on('get-lobby-response'), of(emit('get-lobby', lobbyId)));
  }

  public leaveLobby(): void {
    this.socketService.emit('leave-lobby');
  }

  public onPlayerJoined(): Observable<Player> {
    return this.socketService.on('player-joined');
  }

  public onPlayerLeft(): Observable<Player> {
    return this.socketService.on('player-left');
  }

  public onHostChanged(): Observable<Player> {
    return this.socketService.on('host-changed');
  }

  public startLobby(): void {
    this.socketService.emit('start-lobby');
  }

  public get id(): string {
    return this.socketService.id;
  }
}
