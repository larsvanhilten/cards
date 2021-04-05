import { Player } from './player';

export interface PlayerMap {
  [socketId: string]: Player;
}
