import React from 'react'
import { cn } from '@/lib/utils'

interface BackgroundSlideButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function BackgroundSlideButton({ children, className, onClick }: BackgroundSlideButtonProps) {
  return (
    <button onClick={onClick} className={cn("rounded-xl bg-inherit flex items-center justify-center cursor-pointer group overflow-hidden relative text-primary  transition-all duration-300", className)}>
      <span className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-400" />
      <div className="relative z-10 group-hover:text-white transition-colors duration-300 ">{children}</div>
    </button>
  )
}
