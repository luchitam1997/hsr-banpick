import { TeamColumn } from '@/components/TeamColumn'
import { SelectCharacter } from '@/components/SelectCharacter'

import WaitingScreen from '@/components/WaitingScreen'
import Head from 'next/head'
import EndGameAudienceScreen from '@/components/EndGameAudienceScreen'
import { useOnAudiences } from '@/hooks/useOnAudiences'

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
  } = useOnAudiences()
  return (
    <main className='w-full h-full p-5'>
      <Head>
        <title>{`HSR: All stars / ${roomData?.name}`}</title>
      </Head>
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
          readOnly={true}
          selectedCharacter={selectedCharacter}
          disabledCharacters={disabledCharacters}
          status={roomData?.status}
          onEndGame={handleEndGame}
          isShowSelectedCharacter={true}
          orders={roomData?.order}
          turn={currentTurn}
          teams={roomData?.teams}
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
      {isWaiting && <WaitingScreen />}
      {isFinished && winnerTeam && (
        <EndGameAudienceScreen winner={winnerTeam} />
      )}
    </main>
  )
}
