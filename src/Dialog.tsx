import React, { useState } from "react";
import Background from './images/dialog_background.png';
import BlackBackground from './images/dialog_background_black.png';
import RedBackground from './images/dialog_background_red.png';
import SmallBackground from './images/small_dialog_background.png';
import ClickMeImage from './images/click me.png';

import './Dialog.css';

export interface Conversation {
  text: string;
  reply: string;
  replies?: {text: string, next: number, value?: string}[];
}

export interface DialogProps {
  text: Conversation[][];
  backgroundColor?: string;
  textColor?: string;
  screenColor?: string;
  showClick?: boolean;
  startLevel?: VoidFunction; 
  handleDecision?: (value: string) => void; 
  isAbsolute?: boolean;
}

export default function Dialog({text, backgroundColor, textColor, startLevel, handleDecision, screenColor, isAbsolute, showClick }: DialogProps): JSX.Element {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  let background = setBackground(backgroundColor);
  textColor = textColor || "black";
  document.body.style.backgroundColor = screenColor || "white";
  const handleClick = (next: number, value: string|undefined) => {
    if (value) {
      handleDecision && handleDecision(value)
    } else if (next > 0) {
      setCurrentGroup(next);
      setCurrentMessage(0);
    } else if (currentMessage < text[currentGroup].length - 1) {
      setCurrentMessage(currentMessage + 1);
    } else {
      startLevel && startLevel(); 
    }
  };
  let replies = text[currentGroup][currentMessage].replies ? text[currentGroup][currentMessage].replies : [{text: text[currentGroup][currentMessage].reply, next: 0}];
  replies = replies || [];
  return (
    <div className="dialogContainer" style={{position: isAbsolute ? "absolute" : "relative"}}>
    <div className="dialogBox" style={{backgroundImage:`url(${background})`, color: textColor}}>
      <Message message={text[currentGroup][currentMessage].text} />
    </div>
      {replies.map(reply =>
        <div key={reply.text} onClick={() => handleClick(reply.next, reply.value)} className="dialogFooter" style={{ backgroundImage: `url(${SmallBackground})` }}>
          {reply.text}
          {showClick && <div className="dialog-click-me"><img src={ClickMeImage} alt="click me" /></div>}
      </div>)}
    </div>
  );
}

interface MessageProps {
    message: string;
}

function Message({ message }: MessageProps): JSX.Element {
  return  (
    <div className="dialogText">{message}</div>
  );
}

function setBackground(color:string|undefined) {
  switch (color) {
    case 'black':
      return BlackBackground;
    case 'red':
      return RedBackground;
    case 'white':
      return Background;
  }

  return Background;
}
