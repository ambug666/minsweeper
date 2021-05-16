import React from "react";
import Background from './images/drag_flag_frame.png';
import FlagImage from './images/noun_Flag_1711255.png';
import './DragFlag.css';

export interface DragFlagProps {
}

export default function DragFlag({ }: DragFlagProps): JSX.Element {
    return (
        <div className="drag-flag-container">
            <div className="drag-flag-box" style={{ backgroundImage: `url(${Background})` }}>
                <div draggable={true} onDragStart={(e) => onDragFlagStart(e)}>
                    <img src={FlagImage} alt={`flag`} />
                </div>
                <div className="drag-flag-text">
                    {"⇦ Drag to flag a space."}
                </div>
            </div>
        </div>
    );
}


function onDragFlagStart(e: any) {
    e.dataTransfer.setData("data", JSON.stringify("flag"));
}