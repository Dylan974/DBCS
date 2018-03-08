import { Player } from './player.model';

export interface Pool {
    id: string;
    name: string;
    players: Player[];
}
