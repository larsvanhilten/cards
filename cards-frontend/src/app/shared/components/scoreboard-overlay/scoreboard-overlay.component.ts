import { Component, Input } from '@angular/core';
import { Score } from '@models/oh-hell/score';
import { Player } from '@models/player';

@Component({
  selector: 'scoreboard-overlay',
  templateUrl: './scoreboard-overlay.component.html',
  styleUrls: ['./scoreboard-overlay.component.scss'],
})
export class ScoreboardOverlayComponent {
  @Input() public players: Player[] = [];
  @Input() public roundToResultsMap: [number, Score[]][] = [];
  @Input() public roundsToPlay!: number;

  public calculateScoreSum(playerForScore: Player): number {
    return this.roundToResultsMap.reduce((acc, [_, results]) => {
      const playerResults = results.find(({ player }) => player.socketId === playerForScore.socketId);
      return playerResults ? acc + this.calculateScore(playerResults) : acc;
    }, 0);
  }

  public calculateScore({ bids, tricks }: Score): number {
    if (bids !== tricks) {
      return 0;
    }

    return 10 + tricks;
  }

  public getRound(round: number): number {
    return this.roundsToPlay - 1 - Math.abs(round - (this.roundsToPlay - 1)) + 1;
  }
}
