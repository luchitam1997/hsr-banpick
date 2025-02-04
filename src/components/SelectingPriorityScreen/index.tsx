import { DiceType, Team, Turn } from "@/hooks/types";
import { useMemo, useState } from "react";
import Image from "next/image";
interface SelectingNodeScreenProps {
  onSelectPriority?: (node: DiceType) => void;
  onConfirmPriority?: () => void;
  onNext?: () => void;
  currentTeam?: Team;
  opponentTeam?: Team;
  teams?: Team[];
  turn?: Turn;
}

export const SelectingPriorityScreen = ({
  onSelectPriority,
  onConfirmPriority,
  onNext,
  currentTeam,
  opponentTeam,
  teams,
  turn,
}: SelectingNodeScreenProps) => {
  const [showBanPickDetail, setShowBanPickDetail] = useState(false);
  const openBanPickDetail = () => {
    setShowBanPickDetail(true);
  };
  const closeBanPickDetail = () => {
    setShowBanPickDetail(false);
  };
  const handleSelectPriority = (priority: DiceType) => {
    if (!onSelectPriority || !isMyTurn) return;
    if (
      opponentTeam &&
      opponentTeam.selectPriority &&
      opponentTeam.selectPriority === priority
    )
      return;
    onSelectPriority(priority);
  };

  const handleConfirmPriority = () => {
    if (!onConfirmPriority || !isMyTurn) return;
    onConfirmPriority();
  };

  const currentPlayer = useMemo(() => {
    if (!turn || !teams) return;
    return teams.find((team) => team.id === turn.currentPlayer);
  }, [teams, turn]);

  const teamASelected = useMemo(() => {
    if (!teams) return;
    return teams[0].selectPriority;
  }, [teams]);

  const teamBSelected = useMemo(() => {
    if (!teams) return;
    return teams[1].selectPriority;
  }, [teams]);

  const isMyTurn = useMemo(() => {
    if (!currentTeam || !turn) return false;
    return currentTeam.id === turn.currentPlayer;
  }, [currentPlayer, turn]);

  const isSelectComplete = useMemo(() => {
    if (!teams) return false;
    return teams.every((team) => !!team.selectPriority);
  }, [teams]);

  const Tooltip = ({ team }: { team: Team }) => {
    return (
      <div className="absolute top-[-100%] left-0 w-full h-full flex items-center justify-center">
        <div className="w-full bg-gray-500 text-white px-2 py-1 rounded-lg">
          <h1 className="text-base font-bold text-center">{team.name}</h1>
        </div>
      </div>
    );
  };
  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[600px]">
        <h1 className="text-white text-3xl font-bold mb-20">
          {isSelectComplete
            ? "Đợi host xác nhận"
            : `Team ${currentPlayer?.name} chọn`}
        </h1>
        <div className="w-full flex items-center gap-4 text-white text-2xl font-bold">
          {!showBanPickDetail ? (
            <>
              <div
                className={`p-4 bg-blue-500 w-full rounded-lg relative text-center ${
                  !isMyTurn ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => handleSelectPriority(DiceType.NODE)}
              >
                Chọn map
                {turn &&
                  turn.currentPriority === DiceType.NODE &&
                  currentPlayer && <Tooltip team={currentPlayer} />}
                {teamASelected && teamASelected === DiceType.NODE && teams && (
                  <Tooltip team={teams[0]} />
                )}
                {teamBSelected && teamBSelected === DiceType.NODE && teams && (
                  <Tooltip team={teams[1]} />
                )}
              </div>
              <div
                className={`p-4 bg-red-500 w-full cursor-pointer rounded-lg relative text-center`}
                onClick={openBanPickDetail}
              >
                Ban/Pick
                {turn &&
                  turn.currentPriority &&
                  turn.currentPriority !== DiceType.NODE &&
                  currentPlayer && <Tooltip team={currentPlayer} />}
                {teamASelected && teamASelected !== DiceType.NODE && teams && (
                  <Tooltip team={teams[0]} />
                )}
                {teamBSelected && teamBSelected !== DiceType.NODE && teams && (
                  <Tooltip team={teams[1]} />
                )}
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
                className={`p-4 bg-blue-500 w-full rounded-lg relative text-center ${
                  !isMyTurn ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => handleSelectPriority(DiceType.BANPICK_FIRST)}
              >
                Ban/Pick trước
                {turn &&
                  turn.currentPriority === DiceType.BANPICK_FIRST &&
                  currentPlayer && <Tooltip team={currentPlayer} />}
                {teamASelected &&
                  teamASelected === DiceType.BANPICK_FIRST &&
                  teams && <Tooltip team={teams[0]} />}
                {teamBSelected &&
                  teamBSelected === DiceType.BANPICK_FIRST &&
                  teams && <Tooltip team={teams[1]} />}
              </div>
              <div
                className={`p-4 bg-red-500 w-full rounded-lg relative text-center ${
                  !isMyTurn ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => handleSelectPriority(DiceType.BANPICK_LAST)}
              >
                Ban/Pick sau
                {turn &&
                  turn.currentPriority === DiceType.BANPICK_LAST &&
                  currentPlayer && <Tooltip team={currentPlayer} />}
                {teamASelected &&
                  teamASelected === DiceType.BANPICK_LAST &&
                  teams && <Tooltip team={teams[0]} />}
                {teamBSelected &&
                  teamBSelected === DiceType.BANPICK_LAST &&
                  teams && <Tooltip team={teams[1]} />}
              </div>
            </>
          )}
        </div>
        {isMyTurn &&
          onConfirmPriority &&
          turn &&
          turn.currentPriority &&
          currentTeam && (
            <button
              className={`w-full h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] mt-4 ${
                !!currentTeam.selectPriority
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleConfirmPriority}
            >
              Lock
            </button>
          )}
        {onNext && isSelectComplete && (
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
