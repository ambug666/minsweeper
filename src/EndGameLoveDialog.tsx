import React from 'react';
import Popup from "reactjs-popup";
import HeartsImage from "./images/hearts.png";

import './EndGameLoveDialog.css';

export interface EndGameLoveDialogProps {
    onOK: VoidFunction;
}

export function EndGameLoveDialog({ onOK }: EndGameLoveDialogProps) {
    let okText = ["OK", "Keen", "Cool", "Yay!", "Wow!", "Great!"];
    let num = Math.floor(Math.random() * okText.length);
    return (
    <div className="end-game-love-wrapper">
        <Popup
        open={true}
        modal
        closeOnDocumentClick={false}
    >
        <div className="end-game-love-box">
            <div className="end-game-love-title"> And thus ends this adventure </div>
            <div className="end-game-love-text"> But a new one has just begun </div>
            <div className="end-game-love-item"> <img src={HeartsImage} alt="hearts"/> </div>
            <div className="end-game-love-footer">
                        <button className="end-game-love-button end-game-love-ok" onClick={onOK}>{okText[num]}</button>
            </div>
        </div>

    </Popup>
    </div>);
}