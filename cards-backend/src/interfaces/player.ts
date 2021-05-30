export class Player {
  public username: string;
  public socketId: string;
  public disconnected = false;

  constructor(username: string, socketId: string) {
    this.username = username;
    this.socketId = socketId;
  }
}
