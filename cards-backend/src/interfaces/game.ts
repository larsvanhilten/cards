import { Lobby } from './lobby';

export class Game extends Lobby {
  constructor(lobby: Lobby) {
    super(lobby.host, lobby.id, lobby.players);
  }
}
