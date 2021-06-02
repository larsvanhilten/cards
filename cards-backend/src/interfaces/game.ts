import { Lobby } from './lobby';

export class Game extends Lobby {
  private readyMap = new Map<string, boolean>();

  constructor(lobby: Lobby) {
    super(lobby.host, lobby.id, lobby.players);

    lobby.players.forEach((player) => this.readyMap.set(player.privateId, false));
  }

  public setReady(privateId: string): void {
    this.readyMap.set(privateId, true);
  }

  public get isAllReady(): boolean {
    return !this.allReadyValues.some((ready) => !ready);
  }

  public get isAllDisconnected(): boolean {
    return !this.players.some((player) => !player.disconnected);
  }

  private get allReadyValues(): boolean[] {
    return [...this.readyMap.values()];
  }
}
