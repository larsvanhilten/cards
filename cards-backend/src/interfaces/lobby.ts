import { LobbySummary } from '@shared';
import { Player } from './player';
import { PlayerMap } from './player-map';

export class Lobby {
  public id: string;
  public host: Player;

  private playerMap: PlayerMap = {};

  constructor(host: Player) {
    const { socketId } = host;
    this.id = socketId;
    this.host = host;

    this.playerMap[socketId] = host;
  }

  public toSummary(): LobbySummary {
    const { id } = this;
    const players = this.players.map((p) => p.username);
    const host = this.host.username;

    return { host, id, players };
  }

  public addPlayer(player: Player): boolean {
    const length = this.players.length;
    if (length < 8) {
      this.playerMap[player.socketId] = player;
      return true;
    }
    return false;
  }

  public removePlayer(playerId: string): { player: Player; host: Player } {
    const player = this.playerMap[playerId];
    if (!player) {
      return { player: null, host: null };
    }

    delete this.playerMap[playerId];

    if (this.host.socketId === playerId) {
      this.host = this.players[0];
      return { player: player, host: this.host };
    }

    return { player, host: null };
  }

  public hasPlayer(playerId: string): boolean {
    return this.players.some((player) => player.socketId === playerId);
  }

  private get players(): Player[] {
    return Object.values(this.playerMap);
  }
}
