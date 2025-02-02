interface EndGameScreenProps {
  status: 'win' | 'lose'
}

export default function EndGameScreen({ status }: EndGameScreenProps) {
  return (
    <div className='w-screen h-screen absolute top-0 left-0 bg-black/50 flex items-center justify-center'>
      <p className='text-white text-2xl font-bold text-center'>
        {status === 'win'
          ? 'Congratulations! You win the game.'
          : 'You lose the game. Better luck next time!'}
      </p>
    </div>
  )
}
