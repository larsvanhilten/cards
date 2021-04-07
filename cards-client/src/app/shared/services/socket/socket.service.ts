import { Injectable } from '@angular/core';
import { fromEventPattern, Observable } from 'rxjs';
import { NodeEventHandler } from 'rxjs/internal/observable/fromEvent';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  public get isConnected(): boolean {
    return this.socket?.connected;
  }

  public connect = (): Observable<void> => {
    this.socket = io('http://localhost:3000');
    return this.on('connect');
  };

  public emit = (event: string, data?: any): void => {
    this.socket.emit(event, data);
  };

  public on = (event: string): Observable<any> => {
    const socketHandler = (handler: NodeEventHandler) => this.socket.on(event, handler);
    return fromEventPattern(socketHandler);
  };

  public get id(): string {
    return this.socket.id;
  }
}
