import React, {useState} from "react";
import { Settings } from "./App";
import Map from "./Map";
import {GAME_STATES} from "./Level";
import FlagImage from './images/noun_Flag_1711255.png';


import './Help.css';
enum SCREENS {
    INFO,
    DEMO
}

export interface HelpProps {
    settings: Settings;
    exitHelp: VoidFunction
}

export default function Help({ settings, exitHelp }: HelpProps): JSX.Element {
    const [playing, setPlaying] = useState(GAME_STATES.PLAYING);
    const [clicked, setClicked] = useState(false);
    const [screen, setScreen] = useState(SCREENS.INFO);
    let data = {
      grid: JSON.parse(JSON.stringify(demo)), tiles: { "EMPTY": "dirt2","BOMB": "dirt2", "DISPLAY": "dirt2", "UNKNOWN": "dirt" }, zoom: 1.2, next: "", dialog: {text: []} , tries: 0
    }
    function restart() {
        data.grid = JSON.parse(JSON.stringify(demo));
        setPlaying(GAME_STATES.PLAYING);
        setClicked(!clicked);
    }
    return (
        <div className="help-screen">
            {screen === SCREENS.INFO && 
                <div className="inner-help-screen">
                    <div className="help-title">How To Play Minesweeper</div>
                    <div className="help-text-summary">I know this is a wall of text. Click "Show Game" to get some interactive help.</div>
                    <div className="help-text">The rules to Minesweeper are pretty simple, but the puzzle can be diffficult.</div>
                    <div className="help-text">When you click on a gray or open spot on the grid, it will open up all the surrounding open space displaying some numbers.</div>
                    <div className="help-text">The numbers tell you how many bombs are on the eight spaces surrounding them.</div>
                    <div className="help-text">Using the numbers as clues, you want to continue to click on the unknown spaces until you have revealed where all the bombs are.</div>
                    <div className="help-text">If you click on a bomb, you lose.</div>
                    <div className="help-text">If you reveal all the bombs, you win.</div>
                    <div className="help-text">You can right click on a square to plant a flag. Use those flags to show where you think the bombs are.</div>
                    <div className="help-text">Click on the button below to show a game in progress.</div>
                    <div className="help-button-container">
                        <div className="help-button" onClick={() => setScreen(SCREENS.DEMO)}>Show Game</div>
                        <div className="help-button" onClick={() => exitHelp()}>Return</div>
                    </div>
                </div>
            }
            {screen === SCREENS.DEMO && 
                <div className="inner-help-screen">
                    <div className="help-map-container">
                    <div className="help-map-map-container"> 
                        <Map grid={data.grid}
                            tiles={data.tiles}
                            interactive={playing === GAME_STATES.PLAYING}
                            showbombs={playing !== GAME_STATES.PLAYING}
                            zoom={data.zoom}
                            setLose={() => setPlaying(GAME_STATES.LOST)}
                            setWin={() => setPlaying(GAME_STATES.WON)}
                        />
                        {playing === GAME_STATES.WON && <div className="help-text-summary">You won! You found all the bombs!</div>}
                        {playing === GAME_STATES.LOST && <div className="help-text-summary">You lost... Click Restart to try again.</div>}
                    </div>
                    <div className="help-map-text-container"> 
                        <div className="help-text">In this game, all the spaces with the <span className="green-number">1</span>s have 1 bomb next to them.</div>
                        <div className="help-text">The space with the <span className="blue-number">2</span> has 2 bombs next to it.</div>
                        <div className="help-text">Most of the grid is empty, but we still don't know about the square in the upper left and the upside down T at the bottom.</div>
                        <div className="help-text">We have flagged (<img src={FlagImage} alt="flag" />) a space because we think it contains a bomb. You can flag a space by right clicking on it.</div>
                        <div className="help-text">You can try to solve this. Click on a square to see if it is a bomb. If not, it'll reveal more numbers.</div>
                        <div className="help-text">If it is a bomb, you lose and can try again by clicking the button below.</div>                    </div>
                    </div>
                    <div className="help-text">If this is your first experience with Minesweeper, you may want to try "Just Play Minesweeper" at the main menu a few times before going on the adventure.</div>
                    <div className="help-button-container">
                        <div className="help-button" onClick={() => restart()}>Restart</div>
                        <div className="help-button" onClick={() => setScreen(SCREENS.INFO)}>See the Rules</div>
                        <div className="help-button" onClick={() => exitHelp()}>Return</div>
                    </div>
                </div>
            }
        </div>
    );
}

const demo:any = [[{"type":1,"known":false,"row":0,"column":0,"neighborBombs":2,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":2,"known":false,"row":0,"column":1,"neighborBombs":2,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":0,"column":2,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":0,"column":3,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":0,"column":4,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":0,"column":5,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false}],[{"type":2,"known":false,"row":1,"column":0,"neighborBombs":2,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":false,"row":1,"column":1,"neighborBombs":2,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":1,"column":2,"neighborBombs":2,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":1,"column":3,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":1,"column":4,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":1,"column":5,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false}],[{"type":1,"known":true,"row":2,"column":0,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":2,"column":1,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":2,"column":2,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":2,"known":false,"row":2,"column":3,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false,"flagged":true},{"type":1,"known":true,"row":2,"column":4,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":2,"column":5,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false}],[{"type":1,"known":true,"row":3,"column":0,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":3,"column":1,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":3,"column":2,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":false,"row":3,"column":3,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":3,"column":4,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":3,"column":5,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false}],[{"type":1,"known":true,"row":4,"column":0,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":4,"column":1,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":4,"column":2,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":false,"row":4,"column":3,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":4,"column":4,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":4,"column":5,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false}],[{"type":1,"known":true,"row":5,"column":0,"neighborBombs":0,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":true,"row":5,"column":1,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":2,"known":false,"row":5,"column":2,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":false,"row":5,"column":3,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":1,"known":false,"row":5,"column":4,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false},{"type":2,"known":false,"row":5,"column":5,"neighborBombs":1,"interactive":true,"trapImage":"bomb","nearbig":false}]]