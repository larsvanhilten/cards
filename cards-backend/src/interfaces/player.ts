import { PlayerInfo } from '@models/player-info';

export class Player {
  public username: string;
  public publicId: string;
  public privateId: string;
  public socketId: string;
  public disconnected = false;

  constructor(username: string, publicId: string, privateId: string, socketId: string) {
    this.username = username;
    this.publicId = publicId;
    this.privateId = privateId;
    this.socketId = socketId;
  }

  public getInfo(): PlayerInfo {
    const { username, publicId, disconnected } = this;
    return { username, publicId, disconnected };
  }
}
