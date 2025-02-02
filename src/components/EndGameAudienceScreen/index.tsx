import { Team } from '@/hooks/types'

interface EndGameAudienceScreenProps {
  winner: Team
}

export default function EndGameAudienceScreen({
  winner,
}: EndGameAudienceScreenProps) {
  return (
    <div className='w-screen h-screen absolute top-0 left-0 bg-black/50 flex items-center justify-center'>
      <p className='text-white text-2xl font-bold text-center'>
        Congratulations! {winner.name} wins the game.
      </p>
    </div>
  )
}
