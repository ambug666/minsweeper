import React from 'react';
import Popup from "reactjs-popup";

import './NewGameDialog.css';

export interface NewGameDialogProps {
    onOK: VoidFunction;
    onCancel: VoidFunction;
}

export function NewGameDialog({ onOK, onCancel }: NewGameDialogProps) {
    return (
    <div className="new-game-wrapper">
        <Popup
        open={true}
        modal
        closeOnDocumentClick={false}
    >
        <div className="new-game-box">
            <div className="new-game-title"> Start New Game </div>
            <div className="new-game-text"> This will overwrite your saved game data. Are you sure?</div>
            <div className="new-game-footer">
                <button className="new-game-button new-game-cancel" onClick={onCancel}>Cancel</button>
                <button className="new-game-button new-game-ok" onClick={onOK}>OK</button>
            </div>
        </div>

    </Popup>
    </div>);
}