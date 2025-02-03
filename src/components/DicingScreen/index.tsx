"use client";

import { Team } from "@/hooks/types";
import { useEffect, useMemo, useState } from "react";
import Dice from "react-dice-roll";

interface DicingScreenProps {
  onRoll?: (value: 1 | 2 | 3 | 4 | 5 | 6) => void;
  teams: Team[];
  currentTeam?: Team;
  onNext?: () => void;
}

export const DicingScreen = ({
  onRoll,
  teams,
  currentTeam,
  onNext,
}: DicingScreenProps) => {
  const rollDice = () => {
    if (!onRoll) return;
    const value = Math.floor(Math.random() * 6) + 1;
    onRoll(value as 1 | 2 | 3 | 4 | 5 | 6);
  };

  const [isTeamARolling, setIsTeamARolling] = useState(false);
  const [isTeamBRolling, setIsTeamBRolling] = useState(false);

  const handleTeamARollDice = (ref: any) => {
    if (teams[0].dice && ref && isTeamARolling) {
      ref.rollDice(teams[0].dice);

      setTimeout(() => {
        setIsTeamARolling(false);
      }, 5000);
    }
  };

  const handleTeamBRollDice = (ref: any) => {
    if (teams[1].dice && ref && isTeamBRolling) {
      ref.rollDice(teams[1].dice);

      setTimeout(() => {
        setIsTeamBRolling(false);
      }, 5000);
    }
  };

  useEffect(() => {
    if (teams[0].dice && !isTeamARolling) {
      setIsTeamARolling(true);
    }
  }, [teams[0].dice]);

  useEffect(() => {
    if (teams[1].dice && !isTeamBRolling) {
      setIsTeamBRolling(true);
    }
  }, [teams[1].dice]);

  const isCompleted = useMemo(() => {
    return teams[0].dice !== undefined && teams[1].dice !== undefined;
  }, [teams[0].dice, teams[1].dice]);

  const isAlreadyRolled = useMemo(() => {
    if (!currentTeam) return false;
    if (currentTeam?.id === teams[0].id && teams[0].dice) {
      return true;
    }
    if (currentTeam?.id === teams[1].id && teams[1].dice) {
      return true;
    }
    return false;
  }, [currentTeam, teams[0].dice, teams[1].dice]);

  const buttonLabel = useMemo(() => {
    if (teams[0].dice && teams[1].dice && teams[0].dice === teams[1].dice) {
      return "Reroll";
    }
    return "Next";
  }, [teams[0].dice, teams[1].dice]);

  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[600px] h-[500px]">
        <div className="w-full flex flex-col items-center justify-center gap-20">
          <div className="flex items-center justify-between w-full">
            <p className="w-[200px] text-white text-2xl font-bold mt-2 p-2 bg-blue-500 rounded-md text-center">
              {teams[0].name}
            </p>
            <p className="w-[200px] text-white text-2xl font-bold mt-2 p-2 bg-red-500 rounded-md text-center">
              {teams[1].name}
            </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <Dice
              size={160}
              disabled
              cheatValue={teams[0].dice}
              ref={handleTeamARollDice}
            />
            <h1 className="text-white text-[60px] font-bold">vs</h1>

            <Dice
              size={160}
              disabled
              cheatValue={teams[1].dice}
              ref={handleTeamBRollDice}
            />
          </div>
        </div>

        {onRoll && currentTeam && (
          <button
            className={`w-full text-white text-2xl font-bold p-2 rounded-md mt-20 ${
              currentTeam.id === teams[0].id ? "bg-blue-500" : "bg-red-500"
            } ${isAlreadyRolled ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={rollDice}
            disabled={isAlreadyRolled}
          >
            Roll
          </button>
        )}

        {onNext && (
          <button
            className={`w-full h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] mt-20 ${
              isCompleted ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={onNext}
            disabled={!isCompleted}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};
