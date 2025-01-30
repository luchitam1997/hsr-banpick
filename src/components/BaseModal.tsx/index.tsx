import { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

interface BaseModalProps {
  onClose: () => void
  children: React.ReactNode
}

export const BaseModal = ({ onClose, children }: BaseModalProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref as React.RefObject<HTMLElement>, onClose)

  return (
    <div className='fixed z-50 top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center'>
      <div
        ref={ref}
        className='bg-[#1c1c1c] border border-[#272727] rounded-lg p-4'
      >
        {children}
      </div>
    </div>
  )
}
