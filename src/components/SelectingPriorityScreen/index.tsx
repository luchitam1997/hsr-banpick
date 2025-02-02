import { DiceType } from '@/hooks/types'

interface SelectingNodeScreenProps {
  onSelectPriority: (node: DiceType) => void
}

export const SelectingPriorityScreen = ({
  onSelectPriority,
}: SelectingNodeScreenProps) => {
  return (
    <div className='fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50'>
      <div className='flex items-center gap-4 text-white text-2xl font-bold'>
        <div
          className={`p-4 bg-blue-500 cursor-pointer rounded-lg`}
          onClick={() => onSelectPriority(DiceType.NODE)}
        >
          Chọn map
        </div>
        <div
          className={`p-4 bg-red-500 cursor-pointer rounded-lg`}
          onClick={() => onSelectPriority(DiceType.BANPICK)}
        >
          Ban/Pick
        </div>
      </div>
    </div>
  )
}
