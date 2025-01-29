import { DESTINIES } from '@/constants/destinies'
import { Character, Order, RoomStatus, SelectType, Turn } from '@/hooks/types'
import characters from '@/resources/characters.json'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { EndGameModal } from '../EndGameModal'

interface SelectCharacterProps {
  readOnly: boolean
  onSelect?: (character: Character) => void
  onConfirm?: () => void
  onEndGame?: (team: 'blue' | 'red') => void
  selectedCharacter: string
  disabledCharacters: string[]
  status?: RoomStatus
  orders?: Order[]
  turn?: Turn
  isShowSelectedCharacter?: boolean
}

export function SelectCharacter({
  readOnly,
  onSelect,
  onConfirm,
  onEndGame,
  selectedCharacter,
  disabledCharacters,
  status,
  orders,
  turn,
  isShowSelectedCharacter = false,
}: SelectCharacterProps) {
  const [showSelectedCharacter, setShowSelectedCharacter] = useState(false)
  const [showEndGame, setShowEndGame] = useState(false)

  const [filter, setFilter] = useState<{
    destiny?: string
    name?: string
  }>({
    destiny: undefined,
    name: undefined,
  })

  const handleSelectChar = (character: Character) => {
    if (readOnly || !onSelect) return
    onSelect(character)
  }

  const handleFilterDestiny = (destiny: string) => {
    if (filter.destiny === destiny) {
      setFilter({ ...filter, destiny: undefined })
    } else {
      setFilter({ ...filter, destiny })
    }
  }

  const handleFilterName = (name: string) => {
    setFilter({ ...filter, name })
  }

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      if (filter.destiny && character.destiny !== filter.destiny) {
        return false
      }

      if (
        filter.name &&
        !character.name.toLowerCase().includes(filter.name.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [filter.destiny, filter.name])

  const currentCharacter = useMemo(() => {
    return characters.find((character) => character.name === selectedCharacter)
  }, [selectedCharacter])

  const isDisabled = (character: Character) => {
    return disabledCharacters.includes(character.name)
  }

  useEffect(() => {
    if (currentCharacter && isShowSelectedCharacter) {
      setShowSelectedCharacter(true)
    }

    const timeout = setTimeout(() => {
      setShowSelectedCharacter(false)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [currentCharacter, isShowSelectedCharacter])

  const openEndGameModal = () => {
    setShowEndGame(true)
  }

  const handleEndGame = (team: 'blue' | 'red') => {
    setShowEndGame(false)
    if (onEndGame) {
      onEndGame(team)
    }
  }

  const closeEndGameModal = () => {
    setShowEndGame(false)
  }

  return (
    <div className='basis-1/2'>
      {/* Characters list */}
      <div className='w-full flex items-center justify-between'>
        <div className='flex gap-2'>
          {DESTINIES.map((destiny, index) => (
            <div
              key={index}
              className={` pb-2 ${
                filter.destiny === destiny.slug && 'border-b-2 border-secondary'
              }`}
            >
              <Image
                src={destiny.icon}
                alt={destiny.name}
                width={256}
                height={256}
                className={`w-12 h-12 cursor-pointer hover:opacity-50 `}
                onClick={() => handleFilterDestiny(destiny.slug)}
              />
            </div>
          ))}
        </div>

        {/* Search */}
        <div className='w-[240px] h-[40px] bg-[#1c1c1c] border border-[#272727] rounded flex items-center justify-center p-2'>
          <input
            type='text'
            className='w-full h-full bg-transparent text-primary outline-none'
            onChange={(e) => handleFilterName(e.target.value)}
          />
          <Image
            src='/icons/search.png'
            alt='search'
            width={24}
            height={24}
            className='w-6 h-6'
          />
        </div>
      </div>
      <div className='w-full bg-[#1c1c1c] border border-[#272727] rounded p-4 mt-4 '>
        {filteredCharacters.length > 0 ? (
          <div className='w-full grid grid-cols-8 gap-2'>
            {filteredCharacters.map((character, index) => (
              <div
                key={index}
                className='flex flex-col items-center justify-between'
              >
                <Image
                  width={100}
                  height={100}
                  key={index}
                  src={character.avatar}
                  alt={character.name}
                  className={`  ${
                    isDisabled(character)
                      ? 'grayscale cursor-not-allowed'
                      : 'cursor-pointer hover:opacity-50'
                  }`}
                  onClick={() => handleSelectChar(character)}
                />
                <span className='w-full text-primary text-xs font-bold text-center text-ellipsis overflow-hidden whitespace-nowrap'>
                  {character.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className='w-full text-primary text-center'>No characters found</p>
        )}
      </div>

      {orders && orders.length > 0 && (
        <div className='w-full mt-4 flex items-center justify-center gap-2'>
          {orders.map((order, index) => (
            <span
              key={index}
              className={`p-3 text-primary rounded-full ${
                order.team === 'blue' ? 'bg-blue-500' : 'bg-red-500'
              } ${turn?.currentRound === index ? 'animate-pulse' : ''} ${
                order.team === 'red' ? 'translate-y-full' : ''
              }`}
            >
              {order.order === SelectType.PICK ? 'Pick' : 'Ban'}
            </span>
          ))}
        </div>
      )}

      {status === RoomStatus.SELECTING && onConfirm && (
        <div className='w-full flex items-center justify-center mt-20'>
          <button
            className={`w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] ${
              readOnly ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={onConfirm}
            disabled={readOnly}
          >
            Select
          </button>
        </div>
      )}

      {status === RoomStatus.PLAYING && onEndGame && (
        <div className='w-full flex items-center justify-center mt-20'>
          <button
            className='w-1/2 h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]'
            onClick={openEndGameModal}
          >
            End Game
          </button>
        </div>
      )}

      {showSelectedCharacter && currentCharacter && (
        <div className='w-full h-full bg-black absolute top-0 left-0 z-50 bg-opacity-50 flex items-center justify-center animate-fadeOut'>
          <Image
            src={currentCharacter.image}
            alt={currentCharacter.name}
            className='h-full w-auto'
            width={1000}
            height={1000}
          />
        </div>
      )}

      {showEndGame && (
        <EndGameModal
          onClose={closeEndGameModal}
          onWin={handleEndGame}
        />
      )}
    </div>
  )
}
