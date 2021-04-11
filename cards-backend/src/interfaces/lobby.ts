import { LobbySummary } from '@models/lobby-summary';
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
      this.playerMap.set(host.socketId, host);
    }
  }

  public toSummary(): LobbySummary {
    const { id, players, host } = this;

    return { host, id, players };
  }

  public addPlayer(player: Player): boolean {
    const length = this.players.length;
    if (length < 8) {
      this.playerMap.set(player.socketId, player);
      return true;
    }
    return false;
  }

  public removePlayer(playerId: string): { player: Player; host: Player } {
    const player = this.playerMap.get(playerId);
    if (!player) {
      return { player: null, host: null };
    }

    this.playerMap.delete(playerId);

    if (this.host.socketId === playerId) {
      this.host = this.players[0];
      return { player: player, host: this.host };
    }

    return { player, host: null };
  }

  public getPlayer(playerId: string): Player {
    return this.playerMap.get(playerId);
  }

  public hasPlayer(playerId: string): boolean {
    return this.playerMap.has(playerId);
  }

  public get players(): Player[] {
    return [...this.playerMap.values()];
  }
}
