import { Socket } from 'socket.io';

export interface ExtendedSocket extends Omit<Socket, 'handshake'> {
  lobbyId: string;
  handshake: { query: { username: string } };
}
