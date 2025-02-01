import { useMemo } from 'react'
import PickCard from '../PickCard'
import BanCard from '../BanCard'
import { SelectType, Team, Turn } from '@/hooks/types'

interface TeamColumnProps {
  team: 'blue' | 'red'
  data: Team
  turn?: Turn
}
export function TeamColumn({ team, data, turn }: TeamColumnProps) {
  const timeRemaining = useMemo(() => {
    return `${Math.floor(data.timeRemaining / 60)}:${String(
      data.timeRemaining % 60
    ).padStart(2, '0')}`
  }, [data.timeRemaining])

  const isActive = (index: number, type: SelectType) => {
    if (!turn) return false
    const indexActive =
      type === SelectType.PICK
        ? data.picks.findIndex((item) => !item)
        : data.bans.findIndex((item) => !item)

    const isActive =
      turn.currentSelect?.order === type &&
      turn.currentSelect?.team === team &&
      indexActive === index

    return isActive
  }

  const selectedCharacter = useMemo(() => {
    if (!turn) return
    const isCurrentTeam = turn.currentPlayer === data.id
    if (isCurrentTeam) {
      return turn.currentCharacter
    }
  }, [turn, data.id])

  return (
    <div className='basis-1/4 flex flex-col gap-4'>
      {/* Title */}
      <div className='w-full flex justify-between items-center'>
        {team === 'blue' ? (
          <>
            <p className='text-primary text-2xl font-bold'>{data.name}</p>
            <div
              className={`w-[100px] h-[40px] bg-blue-500 transform skew-x-[20deg] flex items-center justify-center mr-2`}
            >
              <p className={`text-primary text-2xl font-bold -skew-x-[20deg]`}>
                {timeRemaining}
              </p>
            </div>
          </>
        ) : (
          <>
            <div
              className={`w-[100px] h-[40px] bg-red-500 transform skew-x-[-20deg] flex items-center justify-center ml-2`}
            >
              <p className={`text-primary text-2xl font-bold -skew-x-[-20deg]`}>
                {timeRemaining}
              </p>
            </div>
            <p className='text-primary text-2xl font-bold'>{data.name}</p>
          </>
        )}
      </div>

      {/* Pick Cards */}
      <div className='w-full grid grid-cols-2 gap-3'>
        {data.picks.map((character, index) => (
          <PickCard
            key={index}
            name={character.character}
            isCurrentTurn={isActive(index, SelectType.PICK)}
            selectedCharacter={selectedCharacter}
          />
        ))}
      </div>

      {/* Ban Cards */}
      <div className='w-full grid grid-cols-2 gap-3 mt-5'>
        {data.bans.map((character, index) => (
          <BanCard
            key={index}
            name={character}
            isCurrentTurn={isActive(index, SelectType.BAN)}
            selectedCharacter={selectedCharacter}
          />
        ))}
      </div>
    </div>
  )
}
