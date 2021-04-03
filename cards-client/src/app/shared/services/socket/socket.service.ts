import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  public start(): void {
    this.socket = io('http://localhost:3000');
  }

  public create(): void {
    this.socket.emit('create');
  }
}
