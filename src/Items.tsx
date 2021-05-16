import ShieldImage from './images/shield.png';
import BrokenShieldImage from './images/shield_broken.png';
import SpellImage from './images/magic.png';
import UsedSpellImage from './images/magic_used.png';
import InactiveSpellImage from './images/magic_inactive.png';
import PickImage from './images/pick.png';
import MirrorImage from './images/mirror.png';
import TeddyBearimage from './images/teddy bear.png';
import { BlockProps, BLOCK_TYPES } from './Block';
import { checkMap, findEmptySpaceOnMap, inMap, showBombsOnMap } from "./Map";

export class Shield {
    broken = false;
    name = "shield";
    draggable = false;
    helptext = "This shield will block the damage from the first bomb or trap you encounter each level. It will automatically reset for each level."
    get tooltip() {
        if (this.broken) {
            return "This shield has blocked a bomb or trap and cannot be used again this level."
        }
        return "This shield will block the damage from the first bomb or trap you encounter."
    }
    get image() {
        return this.broken ? BrokenShieldImage : ShieldImage;
    }
    activate() {
        this.broken = true; 
    }
    reset() {
        this.broken = false; 
    }
    onDragStart(e: any) {
    }
}

export class Spell {
    used = false;
    activated = false;
    name = "spell";
    helptext = "Drag this spell from inventory to a tile to reveal it and up to four of its neighbors. It will automatically reset for each level. You must click on the grid once before you may use the spell."
    get draggable() {
        return !this.used;
    };
    get tooltip() {
        if (!this.activated) {
            return "You must click on the grid to activate this spell."
        }
        if (this.used) {
            return "This spell has been cast and cannot be used again this level."
        }
        return "Drag this spell to a tile to reveal it and up to four of its neighbors."
    }
    get image() {
        if (!this.activated) {
            return InactiveSpellImage;
        }
        return this.used ? UsedSpellImage : SpellImage;
    }
    activate(target: BlockProps, map: BlockProps[][]) {
        if (!this.activated) {
            this.activated = true;
            return;
        }
        if (target.type !== BLOCK_TYPES.DISPLAY && !this.used) {
            target.known = true;
            let i = 4;
            let { row, column } = target;
            let neighbors = [{ x: -1, y: 1 },{ x: -1, y: 0 },{ x: -1, y: -1 },{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: 1 },{ x: 0, y: -1 } ];
            while (i > 0) {
                let num = Math.floor(Math.random() * neighbors.length);
                let { x, y } = neighbors[num];
                if (inMap(map, row + x, column + y)) {
                    map[row + x][column + y].known = true;
                }
                i--;
            }
            this.used = true; 
        }
    }
    reset() {
        this.used = false;
        this.activated = false;
    }
    onDragStart(e: any) {
        e.dataTransfer.setData("data", JSON.stringify(this));
    }
}

export class Pick {
    used = false;
    name = "pick";
    draggable = false;
    helptext = "Your first click on each level will hit two different empty spaces."
    get tooltip() {
        return "Your first click on each level will hit two different empty spaces."
    }
    get image() {
        return PickImage;
    }
    activate(location: any, map: BlockProps[][]) {
        if (!this.used) {
            let res = findEmptySpaceOnMap(map, location.row, location.column);
            checkMap(map, res.row, res.column);
        }
        this.used = true; 
    }
    reset() {
        this.used = false; 
    }
    onDragStart(e: any) {
    }
}

export class Mirror {
    used = false;
    name = "mirror";
    draggable = false;
    helptext = "Your first click on each level will reveal 1-3 bombs."
    get tooltip() {
        return "Your first click on each level will reveal 1-3 bombs."
    }
    get image() {
        return MirrorImage;
    }
    activate(location: any, map: BlockProps[][]) {
        if (!this.used) {
            showBombsOnMap(map, 3);
        }
        this.used = true; 
    }
    reset() {
        this.used = false; 
    }
    onDragStart(e: any) {
    }
}

export const teddyBear = {
    name: "teddy bear",
    helptext: "You have retrieved your stolen teddy bear. And now you can go back to sleep. You win!",
    image: TeddyBearimage
}
