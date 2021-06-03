import { Socket } from 'socket.io';

export interface ExtendedSocket extends Omit<Socket, 'handshake'> {
  lobbyId: string;
  username: string;
  publicId: string;
  privateId: string;

  handshake: any;
}
