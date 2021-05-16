import React, {useState} from "react";
import Level, { LevelData } from './Level';
import Splash, { DIFFICULTY } from './Splash';
import Sweeper from './Sweeper';
import Help from "./Help";

import './App.css';
import Credits from "./Credits";
import { Mirror, Pick, Shield, Spell } from "./Items";

export interface Settings {
  difficulty: DIFFICULTY;
  achievements: any;
  progressive: boolean;
  hints: number;
  data: LevelData;
  levelname: string;
  items: any[];
}

enum STATE {
  SPLASH,
  GAME,
  HELP,
  CREDITS,
  SWEEPER
}

function App() {
  const [gameState, setGameState] = useState(STATE.SPLASH);
  const [settings, setSettings] = useState(initSettings());
  function loadGame() {
    let lev = window.localStorage.getItem('minesweeper-level');
    if (lev) {
      let str = JSON.parse(lev);
      str.items = replaceItems(str.items);
      setSettings(str);
      setGameState(STATE.GAME);
    }
  }
  function newGame() {
    setSettings(initSettings(settings.hints));
    setGameState(STATE.GAME);
  }
  return (
    <div className="App">
      {gameState === STATE.SPLASH && <Splash
        loadGame={() =>loadGame()}
        newGame={() => newGame()}
        gotoHelp={() => setGameState(STATE.HELP)}
        gotoCredits={() => setGameState(STATE.CREDITS)}
        gotoSweeper={() => setGameState(STATE.SWEEPER)}
        settings={settings}
        updateSettings={setSettings}
      />}
      
      {gameState === STATE.GAME && <Level 
          settings={settings}
          exitGame={() => setGameState(STATE.SPLASH)}
      />}
      
      {gameState === STATE.HELP && <Help 
        settings={settings}
        exitHelp={() => setGameState(STATE.SPLASH)} 
      />}
      
      {gameState === STATE.CREDITS && <Credits 
        settings={settings}
        exitCredits={() => setGameState(STATE.SPLASH)}
      />}
      
      {gameState === STATE.SWEEPER && <Sweeper 
          settings={settings}
          updateSettings={setSettings}
          exitSweeper={() => setGameState(STATE.SPLASH)}
      />}
    </div>
  );
}

function initSettings(hints: number = 0): Settings {
  let lev = window.localStorage.getItem('minesweeper-level');
  let set: Settings = {
    difficulty: DIFFICULTY.MEDIUM,
    progressive: true,
    data: {
      grid: [], tiles: [], zoom: 1.0, next: "", dialog: {text: []} , tries: 0
    },
    hints: lev ? 0 : 1,
    levelname: "intro",  //"intro"
    items: [], //[]
    achievements: {none: "none"}
  };
  if (hints > 0) {
    set.hints = hints;
  }
  return set;
}

function replaceItems(badItems: any[]): any[] {
  let items: any[] = [];
  badItems.forEach(item => {
    switch (item.name) {
      case 'shield':
        items.push(new Shield());
        break;
      case 'spell':
        items.push(new Spell());
        break;
      case 'mirror':
        items.push(new Mirror());
        break;
      case 'pick':
        items.push(new Pick());
        break;
    }
  });
  return items;
}

export default App;
