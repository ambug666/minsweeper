import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import { Settings } from "./App";

import './Splash.css';

import LogoImage from './images/logo.png';
import { NewGameDialog } from "./NewGameDialog";

export enum DIFFICULTY {
    EASY,
    MEDIUM,
    HARD
}

export interface SplashProps {
    gotoHelp: VoidFunction;
    newGame: VoidFunction;
    loadGame: VoidFunction;
    gotoCredits: VoidFunction;
    gotoSweeper: VoidFunction;
    settings: Settings;
    updateSettings: (set:Settings) => void;
}

export default function Splash({ newGame, gotoHelp, gotoCredits, settings, updateSettings, gotoSweeper, loadGame }: SplashProps): JSX.Element {
    const [showNewDialog, setShowNewDialog] = useState(false);
    function setDifficulty(dif: DIFFICULTY) {
        updateSettings({...settings, difficulty: dif});
    }
    function setProgressive(prog: boolean) {
        updateSettings({...settings, progressive: prog});
    }
    function setHints(show: boolean) {
        updateSettings({...settings, hints: show ? 1 : 0});
    }
    function onNewGameClicked() {
        let lev = window.localStorage.getItem('minesweeper-level');
        if (lev) {
            setShowNewDialog(true);
        } else {
            newGame();
        }
    }
    return (
        <div className="splash-screen">
            <div className="inner-splash-screen">
                <div>
                <img src={LogoImage} alt="minsweeper adventures" />
                    <div>by Mike Young</div>
                    <div><a href="http://intink.com">Visit my site</a> for more free games</div>
                </div>
                 <div className="splash-screen-columns">
                    <div className="splash-button-container">
                        <div className="splash-button" onClick={() => onNewGameClicked()}>Start New Adventure</div>
                        <div className="splash-button" onClick={() => loadGame()}>Continue Your Adventure</div>
                        <div className="splash-button" onClick={() => gotoHelp()}>How To Play Minesweeper</div>
                        <div className="splash-button" onClick={() => gotoSweeper()}>Just Play Minesweeper</div>
                        <div className="splash-button" onClick={() => gotoCredits()}>Credits</div>
                    </div>
                    <div className="splash-options-container">
                        <div className="splash-subtitle">Adventure Settings</div>
                        <div>
                            <input
                                name="easy"
                                type="radio"
                                checked={settings.difficulty === DIFFICULTY.EASY}
                                onChange={() => setDifficulty(DIFFICULTY.EASY)}
                                className="splash-radio-button"/>
                            Easy</div>
                        <div>
                            <input
                                name="medium"
                                type="radio"
                                checked={settings.difficulty === DIFFICULTY.MEDIUM}
                                onChange={() => setDifficulty(DIFFICULTY.MEDIUM)}
                                className="splash-radio-button"/>
                            Medium</div>
                        <div>
                            <input
                                name="hard"
                                type="radio"
                                checked={settings.difficulty === DIFFICULTY.HARD}
                                onChange={() => setDifficulty(DIFFICULTY.HARD)}
                                className="splash-radio-button"/>
                            Hard</div>
                        <div className="splash-progress">
                            <input
                                name="progressive"
                                type="checkbox"
                                checked={settings.progressive}
                                onChange={() => setProgressive(!settings.progressive)}
                                className="splash-checkbox" />
                            <div data-tip data-for={`tooltip-easier`} className="splass-progress-text">Progressively Easier</div>
                        </div>
                        <div className="splash-progress">
                            <input
                                name="hints"
                                type="checkbox"
                                checked={!!settings.hints}
                                onChange={() => setHints(!settings.hints)}
                                className="splash-checkbox" />
                                <div data-tip data-for={`tooltip-tips`} className="splass-progress-text">Show Tips</div>
                            </div>
                        <ReactTooltip id={`tooltip-easier`}>
                            Each time you fail in a level, make that level slightly easier.
                        </ReactTooltip>
                        <ReactTooltip id={`tooltip-tips`}>
                            Show minesweeper tips in the first screen.
                        </ReactTooltip>
                    </div>
                    {showNewDialog &&
                        <NewGameDialog onOK={() => newGame()} onCancel={() => setShowNewDialog(false)} />
                    }
                </div>
            </div>
        </div>
    );
}
