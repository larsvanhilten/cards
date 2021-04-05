export class Player {
  public username: string;
  public socketId: string;

  constructor(username: string, socketId: string) {
    this.username = username;
    this.socketId = socketId;
  }
}
