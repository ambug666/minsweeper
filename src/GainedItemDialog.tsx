import React from 'react';
import Popup from "reactjs-popup";

import './GainedItemDialog.css';

export interface GainedItemDialogProps {
    onOK: VoidFunction;
    item: any; 
}

export function GainedItemDialog({ onOK, item }: GainedItemDialogProps) {
    let okText = ["OK", "Keen", "Cool", "Yay!", "Wow!", "Great!"];
    let num = Math.floor(Math.random() * okText.length);
    return (
    <div className="gained-item-wrapper">
        <Popup
        open={true}
        modal
        closeOnDocumentClick={false}
    >
        <div className="gained-item-box">
            <div className="gained-item-title"> You have the {item.name} </div>
            <div className="gained-item-item"> <img src={item.image} alt={item.name}/> </div>
            <div className="gained-item-text"> {item.helptext} </div>
            <div className="gained-item-footer">
                        <button className="gained-item-button gained-item-ok" onClick={onOK}>{okText[num]}</button>
            </div>
        </div>

    </Popup>
    </div>);
}