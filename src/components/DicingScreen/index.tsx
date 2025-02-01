"use client";

import Dice from "react-dice-roll";

interface DicingScreenProps {
  onRoll: (value: 1 | 2 | 3 | 4 | 5 | 6) => void;
  value?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const DicingScreen = ({ onRoll, value }: DicingScreenProps) => {
  const rollDice = (value: 1 | 2 | 3 | 4 | 5 | 6) => {
    onRoll(value);
  };

  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center perspective-[1000px]">
        <Dice
          size={100}
          onRoll={rollDice}
          rollingTime={500}
          disabled={value !== undefined}
          defaultValue={value}
        />
      </div>
    </div>
  );
};
