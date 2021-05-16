import React from "react";
import ReactTooltip from "react-tooltip";
import Background from './images/inventory_frame.png';
import './Inventory.css';

export interface InventoryProps {
    items?: any[];
}

export default function Inventory({ items }: InventoryProps): JSX.Element {
    items = items || [];
    return (
        <div className="inventoryContainer">
            <div className="inventoryBox" style={{ backgroundImage: `url(${Background})` }}>
                <div className="inventoryText">Inventory</div>
                <div className="inventoryItems">
                    {items.map(item => <div key={item.name} draggable={item.draggable} onDragStart={(e) => item.onDragStart(e)}>
                        <img src={item.image} alt={item.name}  data-tip data-for={`tooltip-${item.name}`} />
                        <ReactTooltip id={`tooltip-${item.name}`}>
                            {item.tooltip}
                        </ReactTooltip>
                        </div>)}
                </div>
            </div>
        </div>
    );
}
