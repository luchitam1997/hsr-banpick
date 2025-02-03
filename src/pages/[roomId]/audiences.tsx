import { TeamColumn } from "@/components/TeamColumn";
import { SelectCharacter } from "@/components/SelectCharacter";

import Head from "next/head";
import EndGameAudienceScreen from "@/components/EndGameAudienceScreen";
import { useOnAudiences } from "@/hooks/useOnAudiences";
import { DicingScreen } from "@/components/DicingScreen";
import { SelectingPriorityScreen } from "@/components/SelectingPriorityScreen";
import { SelectingNodeScreen } from "@/components/SelectingNodeScreen";
import WaitingScreen from "@/components/WaitingScreen";

export default function AudiencePage() {
  const {
    roomData,
    handleEndGame,
    isFinished,
    winnerTeam,
    disabledCharacters,
    selectedCharacter,
    currentTurn,
    isWaiting,
    isDicing,
    isSelectCharacter,
    isSelectPriority,
    isSelectNode,
    isSelectRelic,
    isPlaying,
    currentTeam,
    handleNextDicing,
    handleNextSelectPriority,
    handleNextSelectNode,
    handleNextSelectCharacter,
    handleNextSelectRelic,
  } = useOnAudiences();
  return (
    <main className="w-full h-full p-5">
      <Head>
        <title>{`HSR: All stars / ${roomData?.name}`}</title>
      </Head>

      {(isSelectCharacter || isSelectRelic || isPlaying) && (
        <div>
          {/* Header */}
          <div className="w-full h-full flex items-center gap-1">
            <p className="text-secondary text-2xl font-bold">
              Honkai Star Rail: All stars competition /
            </p>
            <p className="text-primary text-2xl font-bold">{roomData?.name}</p>
          </div>
          <div className="mt-4 flex flex-row gap-4">
            {/* Team A */}
            {roomData && roomData.teams[0] && (
              <TeamColumn
                team="blue"
                data={roomData.teams[0]}
                turn={currentTurn}
                readOnly
              />
            )}

            <SelectCharacter
              readOnly={true}
              selectedCharacter={selectedCharacter}
              disabledCharacters={disabledCharacters}
              status={roomData?.status}
              onEndGame={handleEndGame}
              isShowSelectedCharacter={true}
              orders={roomData?.order}
              turn={currentTurn}
              teams={roomData?.teams}
              onNextSelectCharacter={handleNextSelectCharacter}
              onNextSelectRelic={handleNextSelectRelic}
            />

            {/* Team B */}
            {roomData && roomData.teams[1] && (
              <TeamColumn
                team="red"
                data={roomData.teams[1]}
                turn={currentTurn}
                readOnly
              />
            )}
          </div>
        </div>
      )}

      {isWaiting && <WaitingScreen title="Waiting for game start" />}
      {/* Dicing */}
      {isDicing && roomData && (
        <DicingScreen teams={roomData.teams} onNext={handleNextDicing} />
      )}

      {isSelectPriority && roomData && currentTeam && (
        <SelectingPriorityScreen
          onNext={handleNextSelectPriority}
          currentTeam={currentTeam}
        />
      )}

      {isSelectNode && roomData && currentTeam && (
        <SelectingNodeScreen
          readonly
          teams={roomData.teams}
          onNext={handleNextSelectNode}
        />
      )}

      {isFinished && winnerTeam && (
        <EndGameAudienceScreen winner={winnerTeam} />
      )}
    </main>
  );
}
