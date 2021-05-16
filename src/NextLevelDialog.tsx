import React from 'react';
import Popup from "reactjs-popup";

import './NextLevelDialog.css';

export interface NextLevelDialogProps {
    onOK: VoidFunction;
}

export function NextLevelDialog({ onOK }: NextLevelDialogProps) {
    return (
    <div className="next-level-wrapper">
        <Popup
        open={true}
        modal
        closeOnDocumentClick={false}
    >
        <div className="next-level-box">
            <div className="next-level-title"> You did it! </div>
            <div className="next-level-text"> Ready to continue on your journey? </div>
            <div className="next-level-footer">
                <button className="next-level-button next-level-ok" onClick={onOK}>OK</button>
            </div>
        </div>

    </Popup>
    </div>);
}