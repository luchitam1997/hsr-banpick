import { DiceType, Team } from "@/hooks/types";
import { useState } from "react";
import Image from "next/image";
interface SelectingNodeScreenProps {
  onSelectPriority?: (node: DiceType) => void;
  onNext?: () => void;
  currentTeam?: Team;
}

export const SelectingPriorityScreen = ({
  onSelectPriority,
  onNext,
  currentTeam,
}: SelectingNodeScreenProps) => {
  const [showBanPickDetail, setShowBanPickDetail] = useState(false);
  const openBanPickDetail = () => {
    setShowBanPickDetail(true);
  };
  const closeBanPickDetail = () => {
    setShowBanPickDetail(false);
  };
  const handleSelectPriority = (priority: DiceType) => {
    if (!onSelectPriority) return;
    onSelectPriority(priority);
  };

  const Tooltip = () => {
    return (
      currentTeam && (
        <div className="absolute top-[-100%] left-0 w-full h-full flex items-center justify-center">
          <div className="w-full bg-gray-500 text-white px-2 py-1 rounded-lg">
            <h1 className="text-base font-bold text-center">
              {currentTeam.name}
            </h1>
          </div>
        </div>
      )
    );
  };
  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50">
      <div>
        <div className="flex items-center gap-4 text-white text-2xl font-bold">
          {!showBanPickDetail ? (
            <>
              <div
                className={`p-4 bg-blue-500 cursor-pointer rounded-lg relative`}
                onClick={() => handleSelectPriority(DiceType.NODE)}
              >
                Chọn map
                {currentTeam &&
                  currentTeam.selectPriority === DiceType.NODE && <Tooltip />}
              </div>
              <div
                className={`p-4 bg-red-500 cursor-pointer rounded-lg relative`}
                onClick={openBanPickDetail}
              >
                Ban/Pick
                {currentTeam &&
                  currentTeam.selectPriority !== DiceType.NODE && <Tooltip />}
              </div>
            </>
          ) : (
            <>
              <div
                className={`p-4  cursor-pointer rounded-lg`}
                onClick={closeBanPickDetail}
              >
                <Image
                  src={"/icons/back.png"}
                  alt="back"
                  width={24}
                  height={24}
                />
              </div>
              <div
                className={`p-4 bg-blue-500 cursor-pointer rounded-lg relative`}
                onClick={() => handleSelectPriority(DiceType.BANPICK_FIRST)}
              >
                Ban/Pick trước
                {currentTeam &&
                  currentTeam.selectPriority === DiceType.BANPICK_FIRST && (
                    <Tooltip />
                  )}
              </div>
              <div
                className={`p-4 bg-red-500 cursor-pointer rounded-lg relative`}
                onClick={() => handleSelectPriority(DiceType.BANPICK_LAST)}
              >
                Ban/Pick sau
                {currentTeam &&
                  currentTeam.selectPriority === DiceType.BANPICK_LAST && (
                    <Tooltip />
                  )}
              </div>
            </>
          )}
        </div>
        {onNext && currentTeam && currentTeam.selectPriority && (
          <button
            className="w-full h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] mt-4"
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
