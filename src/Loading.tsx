import React from "react";
import BombImage from './images/big_bomb.png';
import './Loading.css';


export interface LoadingProps {
  level: string;
}

export default function Loading({ level }: LoadingProps): JSX.Element {
    
    let className = getClassName(level);
  return (
      <div className={className}>
          {showBomb(level) && <img src={BombImage} alt="bomb" className="bomb-loading" />}
          Loading...
    </div>
  );
}

function getClassName(level: string) {

    switch (level) {
        case "intro":
            return "intro-loading-screen";
        case "bedroom":
            return "bedroom-loading-screen";
        case "river":
        case "lake":
        case "moat":
            return "water-loading-screen";
    }

    return "default-loading-screen";
}


function showBomb(level: string) {

    switch (level) {
        case "intro":
        case "bedroom":
            return false;
    }

    return true;
}