import { TeamColumn } from "@/components/TeamColumn";
import { SelectCharacter } from "@/components/SelectCharacter";
import { useOnTeam } from "@/hooks/useOnTeam";

import { RoomStatus } from "@/hooks/types";
import { SelectingPriorityScreen } from "@/components/SelectingPriorityScreen";
import Head from "next/head";
import { DicingScreen } from "@/components/DicingScreen";
import { SelectingNodeScreen } from "@/components/SelectingNodeScreen";
import PlayingScreen from "@/components/PlayingScreen";
import EndGameScreen from "@/components/EndGameScreen";
import { useMemo } from "react";
import WaitingScreen from "@/components/WaitingScreen";

export default function TeamPage() {
  const {
    roomData,
    isWaiting,
    isCurrentTurn,
    isSelectingPriority,
    isDicing,
    isSelectingNode,
    isFinished,
    isPlaying,
    currentTurn,
    currentTeam,
    nodeDisabled,
    disabledCharacters,
    selectedCharacter,
    opponentTeam,
    handleConfirmBan,
    handleConfirmPick,
    handleSelect,
    handleRoll,
    handleSelectNode,
    handleConfirmNode,
    handleSelectPriority,
    handleSelectRelic,
    handleConfirmPriority,
  } = useOnTeam();

  const teamAReadOnly = useMemo(() => {
    if (!roomData || !currentTeam) return true;
    return (
      currentTeam.id !== roomData.teams[0].id ||
      roomData.teams[0].timeRemaining === 0
    );
  }, [roomData, currentTeam]);

  const teamBReadOnly = useMemo(() => {
    if (!roomData || !currentTeam) return true;
    return (
      currentTeam.id !== roomData.teams[1].id ||
      roomData.teams[1].timeRemaining === 0
    );
  }, [roomData, currentTeam]);

  return (
    <main className="w-full h-full p-5">
      <Head>
        <title>{`HSR: ${roomData?.name} / ${currentTeam?.name}`}</title>
      </Head>

      {/* Select Character */}
      {roomData &&
        (roomData.status === RoomStatus.SELECTING_CHARACTER ||
          roomData.status === RoomStatus.SELECTING_RELIC ||
          roomData.status === RoomStatus.PLAYING) && (
          <div>
            {/* Header */}
            <div className="w-full h-full flex items-center gap-1">
              <p className="text-secondary text-2xl font-bold">
                Honkai Star Rail: All stars competition /
              </p>
              <p className="text-primary text-2xl font-bold">
                {roomData?.name}
              </p>
            </div>

            <div className="mt-4 flex flex-row gap-4">
              {/* Team A */}
              {roomData && roomData.teams[0] && currentTeam && (
                <TeamColumn
                  team="blue"
                  data={roomData.teams[0]}
                  turn={currentTurn}
                  onSelectRelic={handleSelectRelic}
                  readOnly={teamAReadOnly}
                />
              )}

              <SelectCharacter
                readOnly={!isCurrentTurn}
                onSelect={handleSelect}
                onConfirmPick={handleConfirmPick}
                onConfirmBan={handleConfirmBan}
                selectedCharacter={selectedCharacter}
                disabledCharacters={disabledCharacters}
                status={roomData.status}
                orders={roomData.order}
                turn={currentTurn}
                teams={roomData.teams}
              />

              {/* Team B */}
              {roomData && roomData.teams[1] && currentTeam && (
                <TeamColumn
                  team="red"
                  data={roomData.teams[1]}
                  turn={currentTurn}
                  onSelectRelic={handleSelectRelic}
                  readOnly={teamBReadOnly}
                />
              )}
            </div>
          </div>
        )}

      {/* Waiting */}
      {isWaiting && <WaitingScreen title="Waiting for game start" />}

      {/* Dicing */}
      {isDicing && roomData && currentTeam && (
        <DicingScreen
          onRoll={handleRoll}
          teams={roomData.teams}
          currentTeam={currentTeam}
        />
      )}

      {isSelectingPriority && roomData && currentTeam && opponentTeam && (
        <SelectingPriorityScreen
          onSelectPriority={handleSelectPriority}
          onConfirmPriority={handleConfirmPriority}
          teams={roomData.teams}
          turn={roomData.turn}
          currentTeam={currentTeam}
          opponentTeam={opponentTeam}
        />
      )}

      {isSelectingNode && roomData && currentTeam && (
        <SelectingNodeScreen
          onSelectNode={handleSelectNode}
          onConfirmNode={handleConfirmNode}
          nodeDisabled={nodeDisabled}
          isCurrentTurn={isCurrentTurn}
          readonly={false}
          teams={roomData.teams}
          turn={roomData.turn}
        />
      )}

      {isPlaying && <PlayingScreen />}

      {isFinished && currentTeam && roomData && roomData.winner && (
        <EndGameScreen
          status={roomData.winner === currentTeam.id ? "win" : "lose"}
        />
      )}
    </main>
  );
}
