import { Player } from 'src/interfaces/player';

export const playerArrayToMap = (players: Player[]): Map<string, Player> => new Map(players.map((player) => [player.privateId, player]));
