import { Component, Input, OnInit } from '@angular/core';
import { Player } from '@models/player';

@Component({
  selector: 'vertical-revolver',
  templateUrl: './vertical-revolver.component.html',
  styleUrls: ['./vertical-revolver.component.scss'],
})
export class VerticalRevolverComponent implements OnInit {
  @Input() public players: Player[] = [];
  public sortedPlayers: Player[] = [];
  public turn = 0;

  public ngOnInit(): void {
    this.sortedPlayers = this.players;
  }

  public trackById(_: number, player: Player): string {
    return player.socketId;
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

  public restartWith(player: Player): void {
    this.sortedPlayers = this.sort(this.players, player);
    this.turn = 0;
  }

  private sort(players: Player[], startPlayer: Player): Player[] {
    if (!startPlayer) {
      return players;
    }

    const index = this.players.findIndex((p) => p.socketId === startPlayer.socketId);
    const firstHalf = this.players.slice(index, this.players.length);
    const secondHalf = this.players.slice(0, index);

    return [...firstHalf, ...secondHalf];
  }
}
