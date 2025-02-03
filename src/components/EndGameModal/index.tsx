import { Team } from "@/hooks/types";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface EndGameModalProps {
  onClose: () => void;
  onWin: (teams: Team) => void;
  teams: Team[];
}

export function EndGameModal({ onClose, onWin, teams }: EndGameModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref as React.RefObject<HTMLElement>, onClose);

  return (
    <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center">
      <div
        ref={ref}
        className="w-fit h-fit bg-[#1c1c1c] border border-[#272727] rounded-lg p-8"
      >
        <div className="w-full h-full">
          <h2 className="text-2xl font-bold text-primary text-center">
            Who is the winner?
          </h2>
          <div className="flex gap-4 mt-4">
            <button
              className="w-[200px] px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => onWin(teams[0])}
            >
              {teams[0].name}
            </button>
            <button
              className="w-[200px] px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onWin(teams[1])}
            >
              {teams[1].name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
