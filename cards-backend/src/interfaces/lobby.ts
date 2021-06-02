import { LobbyInfo } from '@models/lobby-info';
import { playerArrayToMap } from 'src/utils/player-array-to-map';
import { uuid } from 'src/utils/uuid';
import { Player } from './player';

export class Lobby {
  public id: string;
  public host: Player;

  protected playerMap = new Map<string, Player>();

  constructor(host: Player, id?: string, players?: Player[]) {
    this.id = id || uuid();
    this.host = host;
    if (players) {
      this.playerMap = playerArrayToMap(players);
    } else {
      this.playerMap.set(host.privateId, host);
    }
  }

  public getInfo(): LobbyInfo {
    const { id, players, host } = this;
    return { host, id, players: players.map((p) => p.getInfo()) };
  }

  public addPlayer(player: Player): boolean {
    const length = this.players.length;
    if (length < 8) {
      this.playerMap.set(player.privateId, player);
      return true;
    }
    return false;
  }

  public removePlayer(privateId: string): { player: Player; host: Player } {
    const player = this.playerMap.get(privateId);
    if (!player) {
      return { player: null, host: null };
    }

    this.playerMap.delete(privateId);

    if (this.host.privateId === privateId) {
      this.host = this.players[0];
      return { player: player, host: this.host };
    }

    return { player, host: null };
  }

  public getPlayer(privateId: string): Player {
    return this.playerMap.get(privateId);
  }

  public hasPlayer(privateId: string): boolean {
    return this.playerMap.has(privateId);
  }

  public get players(): Player[] {
    return [...this.playerMap.values()];
  }
}
