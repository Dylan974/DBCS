import { Player } from './player.model';
import { Fight } from './fight.model';

export interface Pool {
    id: string;
    name: string;
    players: Player[];
    fights: Fight[];
    planned_fights: Fight[];
}
