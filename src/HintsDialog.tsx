import React from 'react';
import './HintsDialog.css';

const titles = [
    "New To Minesweeper?",
    "See Those Numbers?",
    "That's a Trap!",
    "See the Flag?",
    "Clear the Space",
    "Another bomb"
];

const texts = [
    "Minesweeper is a game of deduction. There are a bunch of secret mines on the grid and you need to find them.",
    "The numbers tell you how many bombs are next to those squares. Empty squares have no bombs next to them. And the darker squares are still unknown.",
    "See that highlighted space toward the upper left of the grid? There are two 1s diagonal to it (lower left and right) with empty spaces surrounding them. This means that the one unknown space next to them must contain a trap.",
    "The space is now flagged. That means you think there is a bomb there. You can still click on flagged spaces, and right click them to remove the flag.",
    "Your goal is to clear all spaces that don't have bombs. You can tell the new highlighted space is not a bomb because the spaces diagonally below it have a 1 and those spaces have one known bomb next to them so the highlighteds space can't be the bomb. Because you know the bomb is in the flagged space.",
    "Now, you don't want to click on the new highlighted space because the numbers indicate there is a bomb there. See if you can use the rest of the numbers to figure out which spaces have bombs. Good luck!"
];

const instructions = [
    "Click on the grid to continue.",
    "Click this box to continue.",
    "Right click on the highlighted spot to continue.",
    "Click this box to continue.",
    "Click on the highlighted spot to continue.",
    "Click this box to continue.",
];

const update = [
    false,
    true,
    false,
    true,
    false,
    true
];

export interface HintsDialogProps {
    hint: number;
    onClick: VoidFunction;
}

export function HintsDialog({ hint, onClick }: HintsDialogProps) {
    function shouldUpdateHints() {
        if (update[hint - 1]) {
            onClick();
        }
    }
    let cn = update[hint - 1] ? "hints-box hints-box-click" : "hints-box";
    return (
        <div className={cn} onClick={() => shouldUpdateHints()}>
            <div className="hints-title"> {titles[hint-1]} </div>
            <div className="hints-text"> {texts[hint-1]} </div>
            <div className="hints-instructions"> {instructions[hint-1]} </div>
        </div>
   );
}