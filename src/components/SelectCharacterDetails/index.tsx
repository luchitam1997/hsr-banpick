import { useMemo } from 'react'
import { BaseModal } from '../BaseModal.tsx'
import characters from '@/resources/characters.json'
import Image from 'next/image'

interface SelectCharacterDetailsProps {
  selectedCharacter: string
  onClose: () => void
}

export const SelectCharacterDetails = ({
  selectedCharacter,
  onClose,
}: SelectCharacterDetailsProps) => {
  const currentCharacter = useMemo(() => {
    return characters.find((character) => character.name === selectedCharacter)
  }, [selectedCharacter])
  return (
    <BaseModal onClose={onClose}>
      <div>
        <h1>Select Character Details</h1>

        <div className='mt-4 flex gap-4'>
          {currentCharacter && (
            <div>
              <Image
                width={100}
                height={100}
                src={currentCharacter.avatar}
                alt={currentCharacter.name}
              />
              <p className='text-xs w-[100px] text-center'>
                {currentCharacter.name}
              </p>
            </div>
          )}

          <div className='flex flex-col gap-4'>
            <select className='w-[100px] h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]'>
              <option value='0'>0</option>
              <option value='1'>I</option>
              <option value='2'>II</option>
              <option value='3'>III</option>
              <option value='4'>IV</option>
              <option value='5'>V</option>
              <option value='6'>VI</option>
            </select>
            <select className='w-[100px] h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]'>
              <option value='0'>3*</option>
              <option value='1'>4*</option>
              <option value='2'>5* Standard</option>
              <option value='2'>5* Limited</option>
              <option value='2'>5* Trấn</option>
            </select>
          </div>

          <div className='flex flex-col gap-4'>
            <span>Total: 1000</span>
            <button className='w-[100px] h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727]'>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
