import { TeamColumn } from '@/components/TeamColumn'
import { SelectCharacter } from '@/components/SelectCharacter'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { database } from '@/configs/firebase'
import { ref, onValue, set } from 'firebase/database'
import { useRouter } from 'next/router'
import WaitingScreen from '@/components/WaitingScreen'
import {
  Character,
  CharacterSelect,
  RoomData,
  RoomStatus,
  SelectType,
  Turn,
} from '@/hooks/types'
import Head from 'next/head'
import { DicingScreen } from '@/components/DicingScreen'

export default function TeamPage() {
  const router = useRouter()
  const { roomId, teamId } = router.query

  const { roomRef } = useMemo(
    () => ({
      roomRef: ref(database, `rooms/${roomId}`),
    }),
    [roomId]
  )

  // Check status of the room
  const [roomData, setRoomData] = useState<RoomData | null>(null)

  useEffect(() => {
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      setRoomData(snapshot.val() as RoomData)
    })

    return () => {
      unsubscribeRoom()
    }
  }, [roomRef])

  const isWaiting = useMemo(() => {
    return roomData?.status === RoomStatus.WAITING
  }, [roomData])

  const isCurrentTurn = useMemo(() => {
    return roomData?.turn.currentPlayer === teamId
  }, [roomData, teamId])

  const currentTurn = useMemo(() => {
    return roomData?.turn
  }, [roomData])

  const currentTeam = useMemo(() => {
    return roomData?.teams.find((team) => team.id === teamId)
  }, [roomData, teamId])

  const selectedCharacter = useMemo(() => {
    return roomData?.turn.currentCharacter || ''
  }, [roomData])

  const teamIndex = useMemo(() => {
    if (!roomData) return -1
    return roomData.teams.findIndex((team) => team.id === teamId)
  }, [roomData, teamId])

  const isDicing = useMemo(() => {
    if (!roomData || teamIndex < 0) return false
    return (
      roomData.status === RoomStatus.DICING && !roomData.teams[teamIndex].dice
    )
  }, [roomData, teamIndex])

  console.log('isDicing', isDicing)

  const disabledCharacters = useMemo(() => {
    if (!roomData) return []
    const teamAPicks = roomData?.teams[0].picks.map(
      (character) => character.character
    )
    const teamABans = roomData?.teams[0].bans
    const teamBPicks = roomData?.teams[1].picks.map(
      (character) => character.character
    )
    const teamBBans = roomData?.teams[1].bans
    const currentSelect = roomData.turn.currentCharacter
    return [
      ...teamAPicks,
      ...teamABans,
      ...teamBPicks,
      ...teamBBans,
      currentSelect,
    ]
  }, [roomData])

  const handleSelect = async (character: Character) => {
    if (!roomData) return

    await set(roomRef, {
      ...roomData,
      turn: {
        ...roomData.turn,
        currentCharacter: character.name,
      },
    })
  }

  const handleConfirmPick = async (params: CharacterSelect) => {
    if (!roomData) return

    // Check if this is the last pick/ban
    const isLastTurn = roomData.turn.currentRound === roomData.order.length - 1

    const currentTeam = roomData.teams.find(
      (team) => team.id === roomData.turn.currentPlayer
    )

    if (!currentTeam) return

    const currentType = roomData.order[roomData.turn.currentRound]

    if (currentType.order === SelectType.PICK) {
      for (let i = 0; i < currentTeam.picks.length; i++) {
        if (!currentTeam.picks[i].character) {
          currentTeam.picks[i] = params
          break
        }
      }
    }

    const nextRound = isLastTurn
      ? roomData.turn.currentRound
      : roomData.turn.currentRound + 1

    const nextSelect = roomData.order[nextRound]

    const nextPlayer =
      nextSelect.team === 'blue' ? roomData.teams[0].id : roomData.teams[1].id

    // next turn
    const nextTurn: Turn = isLastTurn
      ? {
          currentSelect: null,
          currentCharacter: '',
          currentRound: 0,
          currentPlayer: '',
        }
      : {
          currentSelect: nextSelect,
          currentCharacter: '',
          currentRound: nextRound,
          currentPlayer: nextPlayer,
        }

    const status = isLastTurn
      ? RoomStatus.PLAYING
      : RoomStatus.SELECTING_CHARACTER

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === roomData.turn.currentPlayer ? currentTeam : team
      ),
      turn: nextTurn,
      status,
    })
  }

  const handleConfirmBan = async () => {
    if (!roomData) return

    // Check if this is the last pick/ban
    const isLastTurn = roomData.turn.currentRound === roomData.order.length - 1

    const currentTeam = roomData.teams.find(
      (team) => team.id === roomData.turn.currentPlayer
    )

    if (!currentTeam) return

    for (let i = 0; i < currentTeam.bans.length; i++) {
      if (!currentTeam.bans[i]) {
        currentTeam.bans[i] = roomData.turn.currentCharacter
        break
      }
    }

    const nextRound = isLastTurn
      ? roomData.turn.currentRound
      : roomData.turn.currentRound + 1

    const nextSelect = roomData.order[nextRound]

    const nextPlayer =
      nextSelect.team === 'blue' ? roomData.teams[0].id : roomData.teams[1].id

    // next turn
    const nextTurn: Turn = isLastTurn
      ? {
          currentSelect: null,
          currentCharacter: '',
          currentRound: 0,
          currentPlayer: '',
        }
      : {
          currentSelect: nextSelect,
          currentCharacter: '',
          currentRound: nextRound,
          currentPlayer: nextPlayer,
        }

    const status = isLastTurn
      ? RoomStatus.PLAYING
      : RoomStatus.SELECTING_CHARACTER

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === roomData.turn.currentPlayer ? currentTeam : team
      ),
      turn: nextTurn,
      status,
    })
  }

  const countdown = useCallback(async () => {
    if (!roomData || !isCurrentTurn) return

    const currentTeam = roomData.teams.find(
      (team) => team.id === roomData.turn.currentPlayer
    )

    if (!currentTeam || currentTeam.timeRemaining <= 0) return

    const updatedTeam = {
      ...currentTeam,
      timeRemaining: currentTeam.timeRemaining - 1,
    }

    await set(roomRef, {
      ...roomData,
      teams: roomData.teams.map((team) =>
        team.id === roomData.turn.currentPlayer ? updatedTeam : team
      ),
    })
  }, [roomData, roomRef, isCurrentTurn])

  useEffect(() => {
    const timer = setInterval(() => {
      countdown()
    }, 1000)

    return () => clearInterval(timer)
  }, [roomData, countdown])

  return (
    <main className='w-full h-full p-5'>
      <Head>
        <title>{`HSR: ${roomData?.name} / ${currentTeam?.name}`}</title>
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

      {isWaiting && <WaitingScreen />}
      {isDicing && <DicingScreen />}
    </main>
  )
}
