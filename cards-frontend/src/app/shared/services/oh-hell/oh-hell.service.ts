import { Injectable } from '@angular/core';
import { Bid } from '@models/bid';
import { Card } from '@models/card';
import { OhHellRoundInfo } from '@models/oh-hell-round-info';
import { OhHellScore } from '@models/oh-hell-score';
import { OhHellTurn } from '@models/oh-hell-turn';
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

  public onRoundInfo(): Observable<OhHellRoundInfo> {
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

  public onPlayCard(): Observable<Card> {
    return this.socketService.on('oh-hell/card-played');
  }

  public onRoundWinner(): Observable<string> {
    return this.socketService.on('oh-hell/round-winner');
  }

  public onScores(): Observable<OhHellScore[]> {
    return this.socketService.on('oh-hell/scores');
  }

  public onFinished(): Observable<void> {
    return this.socketService.on('oh-hell/finished');
  }

  public onTurn(): Observable<OhHellTurn> {
    return this.socketService.on('oh-hell/turn');
  }
}
