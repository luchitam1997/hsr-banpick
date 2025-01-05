import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface EndGameModalProps {
  onClose: () => void;
  onWin: (team: "blue" | "red") => void;
}

export function EndGameModal({ onClose, onWin }: EndGameModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref as React.RefObject<HTMLElement>, onClose);

  return (
    <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center">
      <div
        ref={ref}
        className="w-[400px] h-[200px] bg-[#1c1c1c] border border-[#272727] rounded-lg p-4"
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-primary">Select Winner</h2>
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => onWin("blue")}
            >
              Blue team
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onWin("red")}
            >
              Red team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
