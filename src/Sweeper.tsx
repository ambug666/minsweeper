import React, {useState} from "react";
import { Settings } from "./App";
import Inventory from "./Inventory";
import { GAME_STATES } from "./Level";
import Map, { createMap } from "./Map";
import { DIFFICULTY } from "./Splash";
import BigBombHelpImage from './images/big bomb help.png';
import MovingBombHelpImage from './images/moving bomb help.png';

import './Sweeper.css';
// import DragFlag from "./DragFlag";

export enum TILE_TYPES {
    DIRT,
    GRASS,
    WATER
}

let template: string[][] = [];
                
let dirtTiles = { "EMPTY": "dirt2", "BOMB": "dirt2", "DISPLAY": "dirt2", "UNKNOWN": "dirt" };
let grassTiles = { "EMPTY": "wildgrass2", "BOMB": "wildgrass2", "DISPLAY": "wildgrass2", "UNKNOWN": "wildgrass" };
let waterTiles = { "EMPTY": "water2", "BOMB": "water2", "DISPLAY": "water2", "UNKNOWN": "water" };
const numFish = [2, 3, 5];
const numBigBombs = [1, 2, 3];

export interface SweeperProps {
    settings: Settings;
    exitSweeper: VoidFunction;
    updateSettings: (set:Settings) => void;
}

export default function Sweeper({ settings, updateSettings, exitSweeper }: SweeperProps): JSX.Element {
    function setDifficulty(dif: DIFFICULTY) {
        updateSettings({...settings, difficulty: dif});
    }
    const [clicked, setClicked] = useState(true);
    const [firstClick, setFirstClick] = useState(true);
    const [playing, setPlaying] = useState(GAME_STATES.PLAYING);
    const [tileType, setTileType] = useState(TILE_TYPES.DIRT);
    const [fish, setFish] = useState(false);
    const [superBombs, setSuperBombs] = useState(false);
    let { data } = settings;
    if (data.grid.length === 0) {
        newGame();
    }
    function newGame() {
        template = createTemplate(settings.difficulty);
        settings.data = {
            template: template,
            grid: [],
            tiles: getTiles(tileType),
            trap: tileType === TILE_TYPES.WATER ? "mine" : "bomb",
            difficulty: 0.12,
            zoom: 1.2,
            next: "",
            dialog: { text: [] },
            tries: 0,
            movingTrap: tileType === TILE_TYPES.WATER ? "fish" : "gopher",
            movingNumber: fish ? numFish[settings.difficulty] : 0,
            bigTrap: "missile",
            bigNumber: superBombs ? numBigBombs[settings.difficulty] : 0,
        };
        settings.data.grid = createMap(settings);
        setPlaying(GAME_STATES.PLAYING);
        setFirstClick(true);
        setClicked(!clicked);
    }
    let showFishHelp = settings.data.movingNumber && settings.data.movingNumber > 0;
    let showBigHelp = settings.data.bigNumber && settings.data.bigNumber > 0;
    return (
        <div className="sweeper-screen">
            <div className="inner-sweeper-screen">
                <div className="sweeper-title">Minesweeper</div>
                <div className="sweeper-big-container">
                    <div className="sweeper-choices-container">
                        <div className="sweeper-button-container">
                            <div className="sweeper-radio-button-container">
                                <input
                                    name="easy"
                                    type="radio"
                                    checked={settings.difficulty === DIFFICULTY.EASY}
                                    onChange={() => setDifficulty(DIFFICULTY.EASY)}
                                    className="sweeper-radio-button"/>
                                Easy</div>
                            <div className="sweeper-radio-button-container">
                                <input
                                    name="medium"
                                    type="radio"
                                    checked={settings.difficulty === DIFFICULTY.MEDIUM}
                                    onChange={() => setDifficulty(DIFFICULTY.MEDIUM)}
                                    className="sweeper-radio-button"/>
                                Medium</div>
                            <div className="sweeper-radio-button-container">
                                <input
                                    name="hard"
                                    type="radio"
                                    checked={settings.difficulty === DIFFICULTY.HARD}
                                    onChange={() => setDifficulty(DIFFICULTY.HARD)}
                                    className="sweeper-radio-button"/>
                                Hard
                            </div>
                        </div>
                        <div className="sweeper-button-container">
                            <div className="sweeper-radio-button-container">
                                <input
                                    name="dirt"
                                    type="radio"
                                    checked={tileType === TILE_TYPES.DIRT}
                                    onChange={() => setTileType(TILE_TYPES.DIRT)}
                                    className="sweeper-radio-button"/>
                                Dirt</div>
                            <div className="sweeper-radio-button-container">
                                <input
                                    name="grass"
                                    type="radio"
                                    checked={tileType === TILE_TYPES.GRASS}
                                    onChange={() => setTileType(TILE_TYPES.GRASS)}
                                    className="sweeper-radio-button"/>
                                Grass</div>
                            <div className="sweeper-radio-button-container">
                                <input
                                    name="water"
                                    type="radio"
                                    checked={tileType === TILE_TYPES.WATER}
                                    onChange={() => setTileType(TILE_TYPES.WATER)}
                                    className="sweeper-radio-button"/>
                                Water
                            </div>
                        </div>
                    </div>
                    <div className="sweeper-checkbox-container">
                        <div className="sweeper-checkbox">
                            <input
                                name="fish"
                                type="checkbox"
                                checked={fish}
                                onChange={() => setFish(!fish)}
                                className="splash-checkbox" />
                            <div>Moving Animals</div>
                        </div>
                        <div className="sweeper-checkbox">
                            <input
                                name="superBombs"
                                type="checkbox"
                                checked={superBombs}
                                onChange={() => setSuperBombs(!superBombs)}
                                className="splash-checkbox" />
                            <div>Super Bombs</div>
                        </div>
                    </div>
                </div>
                <div className="level-mapContainer">
                    <Map grid={data.grid}
                        tiles={data.tiles}
                        interactive={playing === GAME_STATES.PLAYING}
                        showbombs={playing !== GAME_STATES.PLAYING}
                        zoom={data.zoom}
                        firstClick={firstClick}
                        setFirstClick={setFirstClick}
                        setLose={() => setPlaying(GAME_STATES.LOST)}
                        setWin={() => setPlaying(GAME_STATES.WON)}
                    />
                    <div className="level-sidebar">
                        {/* {(settings.items.length > 0 && settings.data.grid.length > 0) && <Inventory items={settings.items}/>} */}
                        {/* <DragFlag /> */}
                        {showFishHelp ? <img src={MovingBombHelpImage} alt={`help`} /> :  null}
                        {showBigHelp ? <img src={BigBombHelpImage} alt={`help`} /> : null}
                    </div>
                </div>
                {playing === GAME_STATES.PLAYING && <div className="sweeper-text">&nbsp;</div>}
                {playing === GAME_STATES.WON && <div className="sweeper-text">You won! You found all the bombs!</div>}
                {playing === GAME_STATES.LOST && <div className="sweeper-text">You lost... Click New Game to try again.</div>}
                <div className="sweeper-button-container">
                    <div className="sweeper-button" onClick={() => newGame()}>New Game</div>
                    <div className="sweeper-button" onClick={() => exitSweeper()}>Return</div>
                </div>
            </div>
        </div>
    );
}

function createTemplate(difficulty: DIFFICULTY): string[][] {
    let lengths = [8, 12, 16];
    let row:any = [];
    row.length = lengths[difficulty];
    row.fill("");
    let temp: any = [];
    temp.length = lengths[difficulty];
    temp.fill(row);
    return temp;
}

function getTiles(tileset: TILE_TYPES): any {
    let tt = [dirtTiles, grassTiles, waterTiles];
    return tt[tileset];
}