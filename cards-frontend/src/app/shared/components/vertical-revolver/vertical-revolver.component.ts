import { Component, Input, OnChanges } from '@angular/core';
import { PlayerInfo } from '@models/player-info';

@Component({
  selector: 'vertical-revolver',
  templateUrl: './vertical-revolver.component.html',
  styleUrls: ['./vertical-revolver.component.scss'],
})
export class VerticalRevolverComponent implements OnChanges {
  @Input() public players: PlayerInfo[] = [];
  private tricksMap = new Map<string, number>();
  private bidMap = new Map<string, number>();

  public sortedPlayers: PlayerInfo[] = [];
  public turn = 0;

  public ngOnChanges(): void {
    if (this.sortedPlayers.length) {
      this.sortedPlayers = this.sortedPlayers.map((sp) => this.players.find((p) => sp.publicId === p.publicId) || sp);
    } else {
      this.sortedPlayers = this.players;
    }
  }

  public trackById(_: number, player: PlayerInfo): string {
    return player.publicId;
  }

  public getTransform(turn: number): string {
    if (turn === 0 || turn === 1) {
      return 'translateY(0%)';
    }

    return `translateY(${turn * -100 + 100}%)`;
  }

  public increment(): void {
    if (this.turn < this.players.length - 1) {
      this.turn++;
    }
  }

  public setBid(playerId: string, bid: number): void {
    this.bidMap.set(playerId, bid);
  }

  public resetBids(): void {
    this.bidMap.clear();
    this.tricksMap.clear();
  }

  public hasBid(playerId: string): boolean {
    return this.bidMap.has(playerId);
  }

  public getBid(playerId: string): number | undefined {
    return this.bidMap.get(playerId);
  }

  public incrementTricks(playerId: string): void {
    const tricks = this.tricksMap.get(playerId) || 0;
    this.tricksMap.set(playerId, tricks + 1);
  }

  public getTricks(playerId: string): number {
    return this.tricksMap.get(playerId) || 0;
  }

  public restartWith(player: PlayerInfo): void {
    this.sortedPlayers = this.sort(this.players, player);
    this.turn = 0;
  }

  public shouldHide(index: number, turn: number): boolean {
    if (index < turn - 1) {
      return true;
    }

    if (turn === 0 && index > turn + 2) {
      return true;
    }

    if (turn !== 0 && index > turn + 1) {
      return true;
    }

    return false;
  }

  private sort(players: PlayerInfo[], startPlayer: PlayerInfo): PlayerInfo[] {
    if (!startPlayer) {
      return players;
    }

    const index = this.players.findIndex((p) => p.publicId === startPlayer.publicId);
    const firstHalf = this.players.slice(index, this.players.length);
    const secondHalf = this.players.slice(0, index);

    return [...firstHalf, ...secondHalf];
  }
}
