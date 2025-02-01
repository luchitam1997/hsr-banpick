'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export const DicingScreen = () => {
  const [diceNumber, setDiceNumber] = useState(1)
  const [rolling, setRolling] = useState(false)

  const rollDice = () => {
    setRolling(true)
    const newNumber = Math.floor(Math.random() * 6) + 1
    setTimeout(() => {
      setDiceNumber(newNumber)
      setRolling(false)
      //   onRoll(newNumber % 2 === 0 ? 'Team B' : 'Team A')
    }, 1000)
  }

  return (
    <div className='fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50'>
      <div className='flex flex-col items-center'>
        <motion.div
          animate={{ rotate: rolling ? 360 : 0 }}
          transition={{ duration: 1 }}
          className='text-6xl'
        >
          🎲 {diceNumber}
        </motion.div>
        <button
          className='mt-4 px-4 py-2 bg-green-500 text-white rounded'
          onClick={rollDice}
          disabled={rolling}
        >
          Roll
        </button>
      </div>
    </div>
  )
}
