import React from "react";
import { Settings } from "./App";
import TrapImage from './images/noun_item_trap_2360148.png';
import BombImage from './images/noun_Bomb_3821295.png';
import MineImage from './images/noun_sea mines_943177.png';
import FishImage from './images/noun_piranha_28044.png';
import GopherImage from './images/noun_mole_1221064.png';
import MissileImage from './images/noun_Bomb_2726815.png';
import FlagImage from './images/noun_Flag_1711255.png';
import ClickImage from './images/click me.png';

import './Credits.css';

export interface CreditsProps {
    settings: Settings;
    exitCredits: VoidFunction
}

export default function Credits({ settings, exitCredits }: CreditsProps): JSX.Element {
    return (
        <div className="credits-screen">
            <div className="inner-credits-screen">
                <div className="credits-title">Credits</div>
                <div className="credits-text">Game design and programming by Mike Young</div>
                <div className="credits-text"><img src={BombImage} alt={`bomb`} className="credits-icon" />By Fernanddo Santtander from the Noun Project</div>
                <div className="credits-text"><img src={MissileImage} alt={`bomb`} className="credits-icon" />By Susannanova from the Noun Project</div>
                <div className="credits-text"><img src={FlagImage} alt={`bomb`} className="credits-icon" />By Adrien Coquet from the Noun Project</div>
                <div className="credits-text"><img src={MineImage} alt={`bomb`} className="credits-icon" />By Hopkins from the Noun Project</div>
                <div className="credits-text"><img src={GopherImage} alt={`bomb`} className="credits-icon" />By HeadsOfBirds from the Noun Project</div>
                <div className="credits-text"><img src={FishImage} alt={`bomb`} className="credits-icon" />By Luis Prado from the Noun Project</div>
                <div className="credits-text"><img src={TrapImage} alt={`bomb`} className="credits-icon" />By Maxicons from the Noun Project</div>
                <div className="credits-text"><img src={ClickImage} alt={`vlick`} className="credits-icon" />By Iconpacks from the Noun Project</div>
                <div className="credits-text">Tileset: Lanea Zimmerman, Extra Contributions: William Thompson</div>
                <div className="credits-text">Tileset: Buch http://blog-buch.rhcloud.com, and Jeffrey Kern</div>
                <div className="credits-text">Tileset: Axebane's Free! Fantasy Stock Art</div>
                <div className="credits-text">Magic Spell: https://www.patreon.com/cethiel</div>
                <div className="credits-text">Playtesters: Joe Hines, Nicholas Milano, Stephen Edelson, Terry Crew, Tara Clapper, Charley Sumner, Lydia Au, Vince Lupo</div>
                <div className="credits-button-container">
                    <div className="credits-button" onClick={() => exitCredits()}>Return</div>
                </div>
            </div>
        </div>
    );
}
