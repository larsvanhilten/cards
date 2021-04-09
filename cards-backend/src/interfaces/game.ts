import { Lobby } from './lobby';

export class Game extends Lobby {
  private readyMap = new Map<string, boolean>();

  constructor(lobby: Lobby) {
    super(lobby.host, lobby.id, lobby.players);

    lobby.players.forEach((player) => this.readyMap.set(player.socketId, false));
  }

  public setReady(playerId: string): void {
    this.readyMap.set(playerId, true);
  }

  public get isAllReady(): boolean {
    return !this.allReadyValues.some((ready) => !ready);
  }

  private get allReadyValues(): boolean[] {
    return [...this.readyMap.values()];
  }
}
