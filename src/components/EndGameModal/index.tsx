import { Team } from '@/hooks/types'
import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import cycles from '@/resources/cycles.json'

interface EndGameModalProps {
  onClose: () => void
  onWin: (teams: Team[]) => void
  teams: Team[]
}

export function EndGameModal({ onClose, onWin, teams }: EndGameModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [blueCycle, setBlueCycle] = useState<number>(0)
  const [redCycle, setRedCycle] = useState<number>(0)

  useOnClickOutside(ref as React.RefObject<HTMLElement>, onClose)

  const handleWin = () => {
    const newTeams = teams.map((t) => ({ ...t, cycle: 0 }))
    newTeams[0].cycle = blueCycle
    newTeams[0].totalPoints += cycles[blueCycle]
    newTeams[1].cycle = redCycle
    newTeams[1].totalPoints += cycles[redCycle]
    onWin(newTeams)
  }

  return (
    <div className='fixed z-50 top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center'>
      <div
        ref={ref}
        className='w-fit h-[200px] bg-[#1c1c1c] border border-[#272727] rounded-lg p-4'
      >
        <div className='w-full h-full'>
          <h2 className='text-2xl font-bold text-primary text-center'>
            Who is the winner?
          </h2>
          <div className='flex gap-4 mt-4'>
            <div className='border border-blue-500 rounded-lg p-2'>
              <p className='text-primary text-blue-500'>{teams[0].name}</p>
              <input
                type='number'
                className='w-[240px] bg-transparent outline-none border-b border-primary pb-1'
                placeholder='cycles'
                onChange={(e) => setBlueCycle(Number(e.target.value))}
              />
            </div>
            <div className='border border-red-500 rounded-lg p-2'>
              <p className='text-primary text-red-500'>{teams[1].name}</p>
              <input
                type='number'
                className='w-[240px] bg-transparent outline-none border-b border-primary pb-1'
                placeholder='cycles'
                onChange={(e) => setRedCycle(Number(e.target.value))}
              />
            </div>
            {/* <button
              className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              onClick={() => onWin('blue')}
            >
              Blue team
            </button>
            <button
              className='px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              onClick={() => onWin('red')}
            >
              Red team
            </button> */}
          </div>

          <button
            className='w-full h-[40px] bg-[#1c1c1c] border border-[#272727] text-primary rounded hover:bg-[#272727] mt-4'
            onClick={handleWin}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
