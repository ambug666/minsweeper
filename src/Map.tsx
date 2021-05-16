import React, {useState} from 'react';
import { Settings } from './App';
import Block, { BlockProps, BLOCK_TYPES } from './Block';
import DragAndDrop from './DragandDrop';
import { DIFFICULTY } from './Splash';

import StatueU from './images/statue_u.png';
import StatueB from './images/statue_b.png';

import './Map.css';

export interface MapCoordinates {
    row: number,
    column: number
}

export interface MapProps {
    grid: BlockProps[][];
    tiles: any;
    interactive: boolean;
    showbombs?: boolean;
    zoom: number;
    items?: any[];
    firstClick?: boolean;
    statue?: MapCoordinates;
    setFirstClick?: (fc: boolean) => void;
    activateItem?: (item: string, data?: any) => void;
    setLose?: VoidFunction;
    setWin?: VoidFunction;
    incrementHints?: (kind: string) => void;
}

export default function Map({ grid, tiles, interactive, setLose, setWin, activateItem, showbombs, zoom, items, firstClick, setFirstClick, statue, incrementHints }: MapProps): JSX.Element {
    const [clicked, setClicked] = useState(false);
    const [movingBombs, setMovingBombs] = useState<BlockProps[]>([]);
    const [bigBombs, setBigBombs] = useState<BlockProps[]>([]);
    items = items || [];
    if (interactive) {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }
    function handleClick(row: number, column: number) {
        let isNotKnown = grid[row][column].type === BLOCK_TYPES.EMPTY && !grid[row][column].known;
        if (firstClick) {
            let res = initBombs(grid, row, column);
            setMovingBombs(res.movingBombs);
            setBigBombs(res.bigBombs);
            activateItem && activateItem("spell");
            activateItem && activateItem("pick", {row, column});
            activateItem && activateItem("mirror");
            setFirstClick && setFirstClick(false);
        }
        if (grid[row][column].flagged) {
            setClicked(!clicked);
            return;
        }
        if (checkMap(grid, row, column)) {
            let shield = items?.find(item => item.name === "shield");
            if (shield && !shield.broken) {
                setClicked(!clicked);
                activateItem && activateItem("shield");
            } else {
                setLose && setLose();
                return;
            }
        } else {
            if (countUnknown(grid) === 0) {
                setWin && setWin();
                return;
            }
        }
        if (isNotKnown && statue) {
            moveStatue(grid, statue, {row, column});
            if (statue.row === row && statue.column === column) {
                setLose && setLose();
                return;
            }
        }
        if (!firstClick) {
            moveBomb(grid, movingBombs, bigBombs);
            incrementHints && incrementHints("click");
        }
        setClicked(!clicked);
    }
    function handleRightClick(row: number, column: number) {
        toggleFlag(grid, row, column);
        moveBomb(grid, movingBombs, bigBombs);
        incrementHints && incrementHints("rightclick");
        setClicked(!clicked);
    }

    return (
        <div className="map-container" style={{ zoom: zoom }}>
            {grid.map((row, idx) => <MapRow
                row={row}
                key={`row-${idx}`}
                tiles={tiles}
                showbombs={showbombs}
                onClick={(e) => { interactive && handleClick(e.row, e.column) }}
                onRightClick={(e) => { interactive && handleRightClick(e.row, e.column); }}
                activateItem={firstClick ? undefined : activateItem }
            />)}
            {statue && <Statue row={statue.row} column={statue.column} />}
        </div>
    );
}

interface MapRowProps {
    row: BlockProps[];
    tiles: any;
    showbombs?: boolean;
    onClick?: (e: any) => void;
    onRightClick?: (e: any) => void;
    activateItem?: (item: any, data?: any) => void;
}

function MapRow({ row, tiles, onClick, onRightClick, activateItem, showbombs }: MapRowProps): JSX.Element {

    function handleDrop(cell: BlockProps, item: any, activateItem: any) {
        if (cell && item) {
            if (item === "flag") {
                onRightClick && onRightClick({row: cell.row, column: cell.column})
            } else {
                activateItem && activateItem("spell", cell);
            }
        }
    }

    return (
        <div className="map-row">
            {row.map((cell, idx) => <DragAndDrop key={`block-${idx}`} onDrop={(item:any)=> handleDrop(cell, item, activateItem)}>
                <Block {...cell} tiles={tiles} onClick={onClick} onRightClick={onRightClick} forcebomb={showbombs} />
                </DragAndDrop>
            )}
        </div>
    );
}

let cells: number = 0;
let mult = 0.12;
let reduce = 0;
let movingNum = 0;
let bigNum = 0;

export function createMap(settings: Settings): BlockProps[][] {
    let {data} = settings;
    let {template, difficulty, trap, movingTrap, movingNumber, bigTrap, bigNumber, tries } = data;
    if (!template || template.length === 0) {
        return [];
    }
    let map: BlockProps[][] = [];
    let width = template[0].length;
    let height = template.length;
    let i, j;
    cells = 0;
    mult = difficulty || 1.2;
    movingNum = movingNumber || 0;
    bigNum = bigNumber || 0;
    reduce = settings.progressive ? tries : 0;

    mult = (settings.difficulty === DIFFICULTY.EASY) ? mult - 0.02 : mult;
    mult = (settings.difficulty === DIFFICULTY.HARD) ? mult + 0.02 : mult;

    for (j = 0; j < height; j++) {
        let row = [];
        for (i = 0; i < width; i++) {
            let foregroundImage = "";
            let backgroundImage = template[j][i];
            if (backgroundImage.includes("/")) {
                let bg = backgroundImage.split("/");
                foregroundImage = bg[0];
                backgroundImage = bg[1];
            }
            if (template[j][i] === ' ' || template[j][i] === '') {
                cells++;
                row.push({ type: BLOCK_TYPES.EMPTY, known: false, row: j, column: i, neighborBombs: 0, 
                    interactive: true, trapImage: trap, movingTrapImage: movingTrap, bigTrapImage: bigTrap, nearbig: false });
            } else {
                row.push({
                    type: BLOCK_TYPES.DISPLAY, known: true, row: j, column: i, neighborBombs: 0, interactive: false,
                    backgroundImage, foregroundImage, nearbig: false
                });
            }
        }
        map.push(row);
    }
    return map;
}

function initBombs(map: BlockProps[][], row: number, column: number): {movingBombs: BlockProps[], bigBombs: BlockProps[]} {
    let width = map[0].length;
    let height = map.length;
    let movingBombs:BlockProps[] = [];
    let bigBombs:BlockProps[] = [];
    
    let bombs = Math.floor(cells * mult) - reduce;
    bombs = Math.max(bombs, 1);
    bombs = Math.min(bombs, cells - 9);
    //bombs = 1;
    //console.log(bombs);
    
    while (bombs > 0) {
        let x:number = Math.floor(Math.random() * width);
        let y:number = Math.floor(Math.random() * height);
        if (map[y][x].type !== BLOCK_TYPES.BOMB && map[y][x].interactive && !(x >= column - 1 && x <= column + 1 && y >= row - 1 && y <= row + 1)) {
            map[y][x].type = BLOCK_TYPES.BOMB;
            bombs--;
        }
    }

    //movingbombs
    bombs = movingNum - Math.floor(reduce/2);
    bombs = Math.max(bombs, movingNum > 0 ? 1 : 0);
    
    while (bombs > 0) {
        let x:number = Math.floor(Math.random() * width);
        let y:number = Math.floor(Math.random() * height);
        if (map[y][x].type !== BLOCK_TYPES.BOMB && map[y][x].interactive && !(x >= column - 1 && x <= column + 1 && y >= row - 1 && y <= row + 1)) {
            map[y][x].type = BLOCK_TYPES.BOMB;
            map[y][x].moving = true;
            movingBombs.push(map[y][x]);
            bombs--;
        }
    }

    //bigbombs
    bombs = bigNum - Math.floor(reduce/2);
    bombs = Math.max(bombs, bigNum > 0 ? 1 : 0);
    
    while (bombs > 0) {
        let x:number = Math.floor(Math.random() * width);
        let y:number = Math.floor(Math.random() * height);
        if (map[y][x].type !== BLOCK_TYPES.BOMB && map[y][x].interactive && !(x >= column - 1 && x <= column + 1 && y >= row - 1 && y <= row + 1)) {
            map[y][x].type = BLOCK_TYPES.BOMB;
            map[y][x].big = true;
            bigBombs.push(map[y][x]);
            bombs--;
        }
    }
    calcAllNeighborBombs(map, bigBombs);

    return {movingBombs, bigBombs};
}

export function calcAllNeighborBombs(map: BlockProps[][], bigBombs?: BlockProps[]) {
    let width = map[0].length;
    let height = map.length;
    let i, j;

    for (j = 0; j < height; j++) {
        for (i = 0; i < width; i++) {
            map[j][i].neighborBombs = calcNeighborBombs(map, j, i);
            map[j][i].nearbig = false;
        }
    }

    if (bigBombs) {
        bigBombs.forEach(big => {
            let {row, column} = big;
            for (j = row - 2; j <= row + 2; j++) {
                for (i = column - 2; i <= column + 2; i++) {
                    if (inMap(map, j, i) && !(j === row && i === column)) {
                        if ((j === row - 2 || j === row + 2) || (i === column - 2 || i === column + 2)) {
                            map[j][i].nearbig = true;
                            map[j][i].neighborBombs++;
                        }
                    }
                }
            }
        })
    }
}

function calcNeighborBombs(map: BlockProps[][], row: number, column: number): number {
    let i, j, bombs = 0;
    for (j = row - 1; j <= row + 1; j++) {
        for (i = column-1; i <= column + 1; i++) {
            bombs += (inMap(map, j, i) && map[j][i].type === BLOCK_TYPES.BOMB) ? 1 : 0;
        }
    }
    return bombs;
}

export function inMap(map: BlockProps[][], row: number, column: number) {
    return column >= 0 && column < map[0].length && row >= 0 && row < map.length;
}

export function checkMap(map: BlockProps[][], row: number, column: number): boolean {
    if (!inMap(map, row, column)) {
        return false;
    }
    let cell = map[row][column];
    if (!cell.known) {
        if (cell.type === BLOCK_TYPES.BOMB) {
            cell.known = true;
            return true;
        } else {
            updateMap(map, row, column);
        }
    }
    return false;
} 

function updateMap(map: BlockProps[][], row: number, column: number): void {
    if (!inMap(map, row, column)) {
        return;
    }
    let cell = map[row][column];
    if (!cell.known && cell.type !== BLOCK_TYPES.BOMB) {
        cell.known = true;

        if (cell.neighborBombs === 0) {
            let i, j;
            for (j = row-1; j <= row + 1; j++) {
                for (i = column - 1; i <= column + 1; i++) {
                    updateMap(map, j, i);
                }
            }
        }
    }
}

function toggleFlag(map: BlockProps[][], row: number, column: number) {
    let cell = map[row][column];
    if (!cell.known) {
        cell.flagged = !cell.flagged
    }
}

// function showAllMap(map: BlockProps[][]) {
//     map.forEach(row => row.forEach(cell => {
//         cell.known = true;
//     }))
// }

export function countUnknown(map: BlockProps[][]): number {
    let unknown = 0;
    map.forEach(row => row.forEach(cell => {
        unknown += (cell.type !== BLOCK_TYPES.BOMB && !cell.known) ? 1 : 0;
    }));
    return unknown;
}

export function countEmptySpaces(map: BlockProps[][]): number {
    let empty = 0;
    map.forEach(row => row.forEach(cell => {
        empty += (cell.type === BLOCK_TYPES.EMPTY) ? 1 : 0;
    }));
    return empty;
}

export function findEmptySpaceOnMap(map: BlockProps[][], badrow: number, badcolumn: number) {
    let width = map[0].length;
    let height = map.length;
    let x;
    let y;
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while ((x === badcolumn && y === badrow) || map[y][x].type !== BLOCK_TYPES.EMPTY || map[y][x].neighborBombs !== 0);
    return { row: y, column: x };
}

function moveBomb(map: BlockProps[][], movingBombs: BlockProps[], bigBombs?: BlockProps[]) {
    if (movingBombs.length === 0) {
        return;
    }
    let num = Math.floor(Math.random() * movingBombs.length);
    let bomb = movingBombs[num];
    let neighbors = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
    let neighborNum = Math.floor(Math.random() * neighbors.length);
    let row = bomb.row + neighbors[neighborNum].y;
    let column = bomb.column + neighbors[neighborNum].x;
    if (inMap(map, row, column) && map[row][column].type === BLOCK_TYPES.EMPTY && !map[row][column].known && !bomb.known) {
        map[row][column].type = BLOCK_TYPES.BOMB;
        map[row][column].moving = true;
        map[bomb.row][bomb.column].type = BLOCK_TYPES.EMPTY;
        map[bomb.row][bomb.column].flagged = false;
        movingBombs.splice(num, 1);
        movingBombs.push(map[row][column]);
        calcAllNeighborBombs(map, bigBombs);
    }
}

export function showBombsOnMap(map: BlockProps[][], num: number) {
    let width = map[0].length;
    let height = map.length;
    let x;
    let y;
    do {
        do {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
        } while (map[y][x].type !== BLOCK_TYPES.BOMB);
        map[y][x].known = true;
        num--;
    } while (num > 0);
}

interface StatueProps {
    row: number;
    column: number;
}

function Statue({ row, column }: StatueProps): JSX.Element {
    let left = column * 32;
    let top = (row - 1) * 32;
    return (
        <div className="map-statue" style={{left: left, top: top}}>
            <img src={StatueU} alt={`statue`} />
            <img src={StatueB} alt={`statue`} />
        </div>
    );
}


function canStatueMoveThere(map: BlockProps[][], row: number, column: number): boolean {
    return inMap(map, row, column) && map[row][column].type !== BLOCK_TYPES.DISPLAY;
}

// function moveStatue(map: BlockProps[][], statue: MapCoordinates) {
//     let neighbors = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
//     let neighborNum = Math.floor(Math.random() * neighbors.length);
//     let tries = 0;
//     while (!canMoveThere(statue.row + neighbors[neighborNum].y, statue.column + neighbors[neighborNum].x) && tries < neighbors.length) {
//         neighborNum = (neighborNum + 1) % neighbors.length;
//     }
//     if (tries < neighbors.length) {
//         statue.row += neighbors[neighborNum].y;
//         statue.column += neighbors[neighborNum].x
//     }
// }

function moveStatue(map: BlockProps[][], statue: MapCoordinates, click: MapCoordinates) {
    let x = click.column - statue.column;
    let y = click.row - statue.row;
    if (x === 0 && canStatueMoveThere(map, statue.row + Math.sign(y), statue.column)) {
        statue.row += Math.sign(y);
        return;
    }
    if (y === 0 && canStatueMoveThere(map, statue.row, statue.column + Math.sign(x))) {
        statue.column += Math.sign(x);
        return;
    }
    if (Math.abs(x) >= Math.abs(y) && canStatueMoveThere(map, statue.row, statue.column + Math.sign(x))) {
        statue.column += Math.sign(x);
        return;
    }
    if (Math.abs(x) <= Math.abs(y) && canStatueMoveThere(map, statue.row + Math.sign(y), statue.column)) {
        statue.row += Math.sign(y);
        return;
    }
}