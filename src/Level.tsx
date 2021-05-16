import React, {useEffect, useState} from 'react';
import { BlockProps, BLOCK_TYPES } from './Block';
import Dialog, { DialogProps } from './Dialog';
import Map, { createMap, countEmptySpaces, countUnknown, MapCoordinates, calcAllNeighborBombs } from './Map';
import { RestartLevelDialog } from './RestartLevel';
import {NextLevelDialog } from './NextLevelDialog';
import {Shield, Spell, Pick, Mirror, teddyBear } from './Items';
import Inventory from './Inventory';
import { GainedItemDialog } from './GainedItemDialog';
import Loading from './Loading';
import { Settings } from './App';
import { EndGameLoveDialog } from './EndGameLoveDialog';

import './Level.css';

import BigBombHelpImage from './images/big bomb help.png';
import MovingBombHelpImage from './images/moving bomb help.png';
import { HintsDialog } from './HintsDialog';
//import DragFlag from './DragFlag';

export enum GAME_STATES {
    LOADING,
    DIALOG,
    PLAYING,
    WON,
    LOST,
    GAINED_ITEM,
    EPILOGUE1,
    EPILOGUE2,
}

export interface LevelData {
    template?: string[][],
    difficulty?: number;
    zoom: number;
    next: string;
    trap?: string;
    restartText?: string;
    movingNumber?: number;
    movingTrap?: string;
    bigNumber?: number;
    bigTrap?: string;
    grid: BlockProps[][],
    tiles: any;
    dialog: DialogProps;
    easier?: boolean;
    tries: number;
    backgroundColor?: string;
    statue?: MapCoordinates;
}

export interface LevelProps {
    settings: Settings;
    exitGame: VoidFunction;
}

export default function Level({ settings, exitGame }: LevelProps): JSX.Element {
    const [firstClick, setFirstClick] = useState(true);
    const [state, setState] = useState(GAME_STATES.LOADING);
    const [clicked, setClicked] = useState(false);
    useEffect(() => {
        if (state === GAME_STATES.LOADING) {
            loadLevelData(settings.levelname);
        } else if (settings.data.grid.length === 0 && state === GAME_STATES.PLAYING) {
            nextLevel();
        }
    });
    async function loadLevelData(name:string) {
        fetch(`./${name}.json`)
            .then(response => response.json())
            .then(json => {
                setData(settings.data, json);
                settings.data.grid = createMap(settings);
                settings.items.forEach(item => item.reset())
                setState(GAME_STATES.DIALOG);
                setFirstClick(true);
                window.localStorage.setItem('minesweeper-level', JSON.stringify(settings));
            })
            .catch(error => {
                console.error(`Error getting level" ${error}`);
            });
    }
    function restartLevel() {
        settings.data.tries++;
        settings.data.grid = createMap(settings);
        settings.items.forEach(item => item.reset());
        if (settings.data.easier) {
            gardenEasier(settings.data);
        }
        setFirstClick(true);
        setState(GAME_STATES.PLAYING);
    }
    function nextLevel() {
        if (settings.data.next === "epilogue" && fullOfLove(settings)) {
            settings.levelname = "epilogue-love";
        } else {
            settings.levelname = settings.data.next;
        }
        setState(GAME_STATES.LOADING);
    }
    function startLevel() {
        if (settings.data.grid.length > 0 && countEmptySpaces(settings.data.grid) > 0) {
            setFirstClick(true);
            setState(GAME_STATES.PLAYING);
        } else {
            nextLevel();
        }
    }
    function handleValue(value: string) {
        handleGameEffect(value, settings, setState);
    }
    function activateItem(itemName: string, itemData: any) {
        let item = settings.items?.find(item => item.name === itemName);
        item && item.activate(itemData, settings.data.grid);
            if (countUnknown(settings.data.grid) === 0) {
                setState(GAME_STATES.WON);
            }
        setClicked(!clicked);
    }
    function specialFirstClick(click: boolean) {
        if (settings.hints) {
            let row = 0;
            let column = 0;
            let { grid } = settings.data;
            for (row = 5; row < 10; row++) {
                for (column = 4; column < 7; column++) {
                    grid[row][column].known = true;
                    grid[row][column].type = BLOCK_TYPES.EMPTY;
                }
            }
            grid[5][5].known = false;
            grid[5][5].type = BLOCK_TYPES.BOMB;
            grid[6][5].known = false;
            grid[7][5].known = false;
            grid[7][5].type = BLOCK_TYPES.BOMB;
            calcAllNeighborBombs(grid);
            settings.hints++;
        }
        setFirstClick(click);
    }
    function specialSetLose() {
        let { grid } = settings.data;
        if (settings.hints) {
            grid[5][5].known = false;
            grid[6][5].known = false;
            grid[7][5].known = false;
            calcAllNeighborBombs(grid);
        } else {
            setState(GAME_STATES.LOST);
        }
    }
    function incrementHints(kind: string) {
        if (settings.hints > 0) {
            let { grid } = settings.data;
            settings.hints++;
            if (settings.hints === 3) {
                grid[7][5].highlight = true;
            }
            if (settings.hints === 4) {
                grid[7][5].highlight = false;
                grid[7][5].flagged = true;
            }
            if (settings.hints === 5) {
                grid[6][5].highlight = true;
            }
            if (settings.hints === 6) {
                grid[6][5].highlight = false;
                grid[6][5].known = true;
                grid[5][5].highlight = true;
            }
            if (settings.hints === 7) {
                grid[5][5].highlight = false;
                settings.hints = 0;
            }
            setClicked(!clicked);
        }
    }
    return (
        <div className="level-container" style={{backgroundColor: settings.data.backgroundColor}}>
            {state === GAME_STATES.LOADING ? <Loading level={settings.levelname}/> :
            <div className="level-mapContainer">
                <Map
                    grid={settings.data.grid}
                    tiles={settings.data.tiles}
                    interactive={state === GAME_STATES.PLAYING && !(settings.hints === 2 || settings.hints === 4)}
                    showbombs={state !== GAME_STATES.PLAYING} 
                    zoom={settings.data.zoom}
                    items={settings.items}
                    activateItem={(item:string, itemData: any) => activateItem(item, itemData)}
                    firstClick={firstClick}
                    setFirstClick={specialFirstClick}
                    statue={settings.data.statue}
                    setLose={() => specialSetLose()}
                    setWin={() => setState(GAME_STATES.WON)}
                    incrementHints={(kind:string) => incrementHints(kind)} />
                <div className="level-sidebar">
                    {settings.items.length > 0 && settings.data.grid.length > 0 && <Inventory items={settings.items}/>}
                    {/* {state === GAME_STATES.PLAYING && <DragFlag />} */}
                    {settings.data.movingNumber && settings.data.movingNumber > 0 && <img src={MovingBombHelpImage} alt={`help`} />}
                    {settings.data.bigNumber && settings.data.bigNumber > 0 && <img src={BigBombHelpImage} alt={`help`} />}
                 </div>
                </div>
            }
            {state === GAME_STATES.PLAYING && settings.hints > 0 && 
                <HintsDialog hint={settings.hints} onClick={() => incrementHints("hintbox")}/>
            }
            {state === GAME_STATES.LOST && 
                <RestartLevelDialog onOK={() => restartLevel()} text={settings.data.restartText}/>
            }
            {state === GAME_STATES.WON &&
                <NextLevelDialog onOK={() => nextLevel()} />
            }
            {state === GAME_STATES.DIALOG && 
                <Dialog {...settings.data.dialog} startLevel={() => startLevel()} handleDecision={(value:string) => handleValue(value)} isAbsolute={settings.data.grid.length > 0}/>
            }
            {state === GAME_STATES.GAINED_ITEM &&
                <GainedItemDialog onOK={() => nextLevel()} item={settings.items[settings.items.length - 1]} />
            }
            {state === GAME_STATES.EPILOGUE1 &&
                <GainedItemDialog onOK={() => exitGame()} item={teddyBear} />
            }
            {state === GAME_STATES.EPILOGUE2 &&
                <EndGameLoveDialog onOK={() => exitGame()} />
            }
        </div>
    );
}

function setData(data: LevelData, json: any): void {
    //json.template.forEach(row => console.log(row.length));
    data.template = json.template;
    data.difficulty = json.difficulty;
    data.tiles = json.tiles;
    data.dialog = json.dialog;
    data.zoom = json.zoom;
    data.next = json.next;
    data.trap = json.trap;
    data.movingTrap = json.movingtrap;
    data.movingNumber = json.movingnumber;
    data.bigTrap = json.bigtrap;
    data.bigNumber = json.bignumber;
    data.restartText = json.restartText;
    data.easier = false;
    data.tries = 0;
    data.backgroundColor = json.backgroundColor;
    data.statue = json.statue;
}

function handleGameEffect(value: string, settings: Settings, setState: (s: GAME_STATES) => void) {
    if (settings.achievements[settings.levelname] === value) {
        setState(GAME_STATES.PLAYING);
        return;
    }
    else if (value === "shield" && settings.levelname === "merchant1") {
        settings.items.push(new Shield());
        setState(GAME_STATES.GAINED_ITEM);
    }
    else if (value === "spell" && settings.levelname === "merchant1") {
        settings.items.push(new Spell());
        setState(GAME_STATES.GAINED_ITEM);
    }
    else if (value === "pick" && settings.levelname === "merchant2") {
        settings.items.push(new Pick());
        setState(GAME_STATES.GAINED_ITEM);
    }
    else if (value === "mirror" && settings.levelname === "merchant2") {
        settings.items.push(new Mirror());
        setState(GAME_STATES.GAINED_ITEM);
    }
    else if (value === "mcguffin") {
        setState(GAME_STATES.EPILOGUE1);
    }
    else if (value === "end-love") {
        setState(GAME_STATES.EPILOGUE2);
    }
    else if (value === "easier" && settings.levelname === "garden") {
        settings.data.easier = true;
        gardenEasier(settings.data);
        setState(GAME_STATES.PLAYING);
    } else {
        setState(GAME_STATES.PLAYING);
    }
    settings.achievements[settings.levelname] = value;
}

function gardenEasier(data: LevelData) {
    let row, column;
    for (row = 3; row < 6; row++) {
        for (column = 19; column < 22; column++) {
            data.grid[row][column].known = true;
        }
    }
}

const FULL_LOVE = 5;

function fullOfLove(settings: Settings): boolean {
    let love = 0;
    for (const ach in settings.achievements) {
        love += (settings.achievements[ach] === "love") ? 1 : 0;
        love += (settings.achievements[ach] === "easier") ? 1 : 0;
    }
    //console.log(settings.achievements, love);
    return love >= FULL_LOVE;
}