import { DiceType } from "@/hooks/types";
import { useState } from "react";

interface SelectingNodeScreenProps {
  onSelectPriority: (node: DiceType) => void;
}

export const SelectingPriorityScreen = ({
  onSelectPriority,
}: SelectingNodeScreenProps) => {
  const [showBanPickDetail, setShowBanPickDetail] = useState(false);
  const openBanPickDetail = () => {
    setShowBanPickDetail(true);
  };
  const closeBanPickDetail = () => {
    setShowBanPickDetail(false);
  };
  const handleSelectPriority = (priority: DiceType) => {
    onSelectPriority(priority);
    closeBanPickDetail();
  };
  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50">
      <div className="flex items-center gap-4 text-white text-2xl font-bold">
        {!showBanPickDetail ? (
          <>
            <div
              className={`p-4 bg-blue-500 cursor-pointer rounded-lg`}
              onClick={() => handleSelectPriority(DiceType.NODE)}
            >
              Chọn map
            </div>
            <div
              className={`p-4 bg-red-500 cursor-pointer rounded-lg`}
              onClick={openBanPickDetail}
            >
              Ban/Pick
            </div>
          </>
        ) : (
          <>
            <div
              className={`p-4 bg-blue-500 cursor-pointer rounded-lg`}
              onClick={() => handleSelectPriority(DiceType.BANPICK_FIRST)}
            >
              Ban/Pick trước
            </div>
            <div
              className={`p-4 bg-red-500 cursor-pointer rounded-lg`}
              onClick={() => handleSelectPriority(DiceType.BANPICK_LAST)}
            >
              Ban/Pick sau
            </div>
          </>
        )}
      </div>
    </div>
  );
};
