import { Injectable } from '@angular/core';
import { fromEventPattern, Observable } from 'rxjs';
import { NodeEventHandler } from 'rxjs/internal/observable/fromEvent';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  public get isConnected(): boolean {
    return this.socket?.connected;
  }

  public connect = (username: string, publicId: string, privateId: string): Observable<void> => {
    this.socket?.disconnect();
    this.socket = io(environment.socketUrl, { query: { username, publicId, privateId } });
    return this.on('connect');
  };

  public onReconnect(): Observable<void> {
    return this.onIO('reconnect');
  }

  public onDisconnect(): Observable<void> {
    return this.on('disconnect');
  }

  public emit = (event: string, data?: any): void => {
    this.socket?.emit(event, data);
  };

  private onIO = (event: string): Observable<any> => {
    const socketHandler = (handler: NodeEventHandler) => (this.socket?.io as any)?.on(event, handler);
    return fromEventPattern(socketHandler);
  };

  public on = (event: string): Observable<any> => {
    const socketHandler = (handler: NodeEventHandler) => this.socket?.on(event, handler);
    return fromEventPattern(socketHandler);
  };
}
