import { useMemo, useState } from 'react'
import { BaseModal } from '../BaseModal.tsx'
import characters from '@/resources/characters.json'
import costs from '@/resources/costs.json'
import Image from 'next/image'
import { CharacterSelect, WeaponType } from '@/hooks/types'

interface SelectCharacterDetailsProps {
  selectedCharacter: string
  onClose: () => void
  onConfirm: (params: CharacterSelect) => void
}

const weaponStandardCosts = [0, 0.5, 1, 1.5, 2]
const weaponLimitedCosts = [0, 0.5, 1, null, null]

export const SelectCharacterDetails = ({
  selectedCharacter,
  onClose,
  onConfirm,
}: SelectCharacterDetailsProps) => {
  const [relic, setRelic] = useState<number>(0)
  const [weaponType, setWeaponType] = useState<WeaponType>(WeaponType.COMMON)
  const [weaponLevel, setWeaponLevel] = useState<number>(1)

  const currentCharacter = useMemo(() => {
    return characters.find((character) => character.name === selectedCharacter)
  }, [selectedCharacter])

  const characterCost = useMemo(() => {
    return costs.find(
      (cost) => cost.name.toLowerCase() === currentCharacter?.name.toLowerCase()
    )
  }, [currentCharacter])

  const handleChangeRelic = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRelic(Number(e.target.value))
  }

  const handleChangeWeaponType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWeaponType(e.target.value as WeaponType)
  }

  const handleChangeWeaponLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWeaponLevel(Number(e.target.value))
  }

  const totalPoint = useMemo(() => {
    if (!characterCost) return 0

    let total = characterCost.costs[relic] || 0

    if (weaponType === WeaponType.SPECIAL) {
      total += characterCost.weapon
    }

    if (weaponType === WeaponType.STANDARD) {
      total += weaponStandardCosts[weaponLevel - 1]
    } else if (
      weaponType === WeaponType.LIMITED ||
      weaponType === WeaponType.SPECIAL
    ) {
      total += weaponLimitedCosts[weaponLevel - 1] || 0
    }

    return total
  }, [relic, characterCost, weaponType, weaponLevel])

  const romanNumber = (number: number) => {
    const roman = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
    return roman[number]
  }

  const handleConfirm = () => {
    onConfirm({
      character: selectedCharacter,
      relic,
      weapon: weaponType,
      weaponLevel,
      point: totalPoint,
    })
    onClose()
  }

  return (
    <BaseModal onClose={onClose}>
      <div>
        <h1 className='text-white'>Select Character Details</h1>

        <div className='mt-4 flex gap-4'>
          {currentCharacter && (
            <Image
              width={100}
              height={100}
              src={currentCharacter.avatar}
              alt={currentCharacter.name}
              className='w-[200px] h-full object-cover'
            />
          )}

          <div className='w-[300px] flex flex-col gap-4'>
            <div className='w-full flex gap-2 items-center justify-between'>
              <label className='text-white'>Tinh hồn: </label>
              <select
                className='w-[160px] h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]'
                onChange={handleChangeRelic}
              >
                {characterCost?.costs.map(
                  (cost, index) =>
                    cost && (
                      <option
                        value={index}
                        key={index}
                      >
                        {romanNumber(index)}
                      </option>
                    )
                )}
              </select>
            </div>

            <div className='w-full flex gap-2 items-center justify-between'>
              <label className='text-white'>Nón ánh sáng: </label>
              <select
                className='w-[160px] h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]'
                onChange={handleChangeWeaponType}
              >
                <option value={WeaponType.COMMON}>3*</option>
                <option value={WeaponType.COMMON}>4*</option>
                <option value={WeaponType.COMMON}>Shop Herta</option>
                <option value={WeaponType.STANDARD}>5* Standard</option>
                <option value={WeaponType.LIMITED}>5* Limited</option>
                <option value={WeaponType.SPECIAL}>5* Trấn</option>
              </select>
            </div>

            <div className='w-full flex gap-2 items-center justify-between'>
              <label className='text-white'>Tích tầng: </label>
              <select
                className='w-[160px] h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]'
                onChange={handleChangeWeaponLevel}
              >
                {weaponType === WeaponType.LIMITED ||
                weaponType === WeaponType.SPECIAL
                  ? weaponLimitedCosts.map((cost, index) => (
                      <option
                        value={index + 1}
                        disabled={cost === null}
                        key={index}
                      >
                        {romanNumber(index + 1)}
                      </option>
                    ))
                  : weaponStandardCosts.map((_, index) => (
                      <option
                        value={index + 1}
                        key={index}
                      >
                        {romanNumber(index + 1)}
                      </option>
                    ))}
              </select>
            </div>
          </div>
        </div>

        <div className='w-full border-t border-[#272727] flex pt-4 justify-end'>
          <span className='text-white'>Tổng điểm: {totalPoint}</span>
        </div>

        <button
          className='w-full h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] mt-4'
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </BaseModal>
  )
}
