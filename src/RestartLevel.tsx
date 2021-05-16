import React from 'react';
import Popup from "reactjs-popup";

import './RestartLevel.css';

export interface RestartLevelDialogProps {
    text?: string;
    onOK: VoidFunction;
}

export function RestartLevelDialog({ text, onOK }: RestartLevelDialogProps) {
    text = text || "You got caught in a trap! Want to try the level again ?";
    return (
    <div className="restart-level-wrapper">
        <Popup
        open={true}
        modal
        closeOnDocumentClick={false}
    >
        <div className="restart-level-box">
            <div className="restart-level-title"> Uh-Oh </div>
                    <div className="restart-level-text"> {text} </div>
            <div className="restart-level-footer">
                <button className="restart-level-button restart-level-ok" onClick={onOK}>OK</button>
            </div>
        </div>

    </Popup>
    </div>);
}