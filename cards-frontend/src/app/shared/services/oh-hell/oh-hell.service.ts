import { Injectable } from '@angular/core';
import { Card } from '@models/card';
import { Bid } from '@models/oh-hell/bid';
import { CardPlayed } from '@models/oh-hell/card-played';
import { GameInfo } from '@models/oh-hell/game-info';
import { OhHellState } from '@models/oh-hell/oh-hell-state';
import { RoundInfo } from '@models/oh-hell/round-info';
import { Score } from '@models/oh-hell/score';
import { Turn } from '@models/oh-hell/turn';
import { PlayerInfo } from '@models/player-info';
import { Observable } from 'rxjs';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class OhHellService {
  constructor(private socketService: SocketService) {}

  public ready(): void {
    this.socketService.emit('oh-hell/ready');
  }

  public reconnect(lobbyId: string): void {
    this.socketService.emit('oh-hell/reconnect', lobbyId);
  }

  public onGameInfo(): Observable<GameInfo> {
    return this.socketService.on('oh-hell/game-info');
  }

  public onRoundInfo(): Observable<RoundInfo> {
    return this.socketService.on('oh-hell/round-info');
  }

  public placeBid(bid: number): void {
    this.socketService.emit('oh-hell/place-bid', bid);
  }

  public onBidPlaced(): Observable<Bid> {
    return this.socketService.on('oh-hell/bid-placed');
  }

  public playCard(card: Card): void {
    this.socketService.emit('oh-hell/play-card', card);
  }

  public onCardPlayed(): Observable<CardPlayed> {
    return this.socketService.on('oh-hell/card-played');
  }

  public onRoundWinner(): Observable<PlayerInfo> {
    return this.socketService.on('oh-hell/round-winner');
  }

  public onScores(): Observable<Score[]> {
    return this.socketService.on('oh-hell/scores');
  }

  public onTurn(): Observable<Turn> {
    return this.socketService.on('oh-hell/turn');
  }

  public onPlayerUpdate(): Observable<PlayerInfo> {
    return this.socketService.on('oh-hell/player-update');
  }

  public onGameState(): Observable<OhHellState> {
    return this.socketService.on('oh-hell/game-state');
  }
}
