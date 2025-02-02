import { TeamColumn } from '@/components/TeamColumn'
import { SelectCharacter } from '@/components/SelectCharacter'
import { useOnTeam } from '@/hooks/useOnTeam'
import WaitingScreen from '@/components/WaitingScreen'
import { RoomStatus } from '@/hooks/types'
import { SelectingPriorityScreen } from '@/components/SelectingPriorityScreen'
import Head from 'next/head'
import { DicingScreen } from '@/components/DicingScreen'
import { SelectingNodeScreen } from '@/components/SelectingNodeScreen'
import PlayingScreen from '@/components/PlayingScreen'
import EndGameScreen from '@/components/EndGameScreen'

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
    handleConfirmBan,
    handleConfirmPick,
    handleSelect,
    handleRoll,
    handleSelectNode,
    handleSelectPriority,
  } = useOnTeam()
  return (
    <main className='w-full h-full p-5'>
      <Head>
        <title>{`HSR: ${roomData?.name} / ${currentTeam?.name}`}</title>
      </Head>

      {/* Select Character */}
      {(roomData?.status === RoomStatus.SELECTING_CHARACTER ||
        roomData?.status === RoomStatus.PLAYING) && (
        <div>
          {/* Header */}
          <div className='w-full h-full flex items-center gap-1'>
            <p className='text-secondary text-2xl font-bold'>
              Honkai Star Rail: All stars competition /
            </p>
            <p className='text-primary text-2xl font-bold'>{roomData?.name}</p>
          </div>

          <div className='mt-4 flex flex-row gap-4'>
            {/* Team A */}
            {roomData && roomData.teams[0] && (
              <TeamColumn
                team='blue'
                data={roomData.teams[0]}
                turn={currentTurn}
              />
            )}

            <SelectCharacter
              readOnly={!isCurrentTurn}
              onSelect={handleSelect}
              onConfirmPick={handleConfirmPick}
              onConfirmBan={handleConfirmBan}
              selectedCharacter={selectedCharacter}
              disabledCharacters={disabledCharacters}
              status={roomData?.status}
              orders={roomData?.order}
              turn={currentTurn}
            />

            {/* Team B */}
            {roomData && roomData.teams[1] && (
              <TeamColumn
                team='red'
                data={roomData.teams[1]}
                turn={currentTurn}
              />
            )}
          </div>
        </div>
      )}

      {/* Waiting */}
      {isWaiting && <WaitingScreen />}

      {/* Dicing */}
      {isDicing && (
        <DicingScreen
          onRoll={handleRoll}
          value={currentTeam?.dice}
        />
      )}

      {isSelectingPriority &&
        (isCurrentTurn ? (
          <SelectingPriorityScreen onSelectPriority={handleSelectPriority} />
        ) : (
          <WaitingScreen />
        ))}

      {isSelectingNode && (
        <SelectingNodeScreen
          onSelectNode={handleSelectNode}
          nodeDisabled={nodeDisabled}
          readonly={!isCurrentTurn}
        />
      )}

      {isPlaying && <PlayingScreen />}

      {isFinished && currentTeam && roomData && roomData.winner && (
        <EndGameScreen
          status={roomData.winner === currentTeam.id ? 'win' : 'lose'}
        />
      )}
    </main>
  )
}
