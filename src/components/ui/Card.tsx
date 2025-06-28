import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
  const baseStyles = 'rounded-xl border border-gray-700 transition-all duration-200'
  const hoverStyles = hover ? 'hover:border-gray-600 hover:shadow-lg cursor-pointer' : ''
  const backgroundStyles = gradient 
    ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
    : 'bg-gray-800'

  return (
    <div className={`${baseStyles} ${hoverStyles} ${backgroundStyles} ${className}`}>
      {children}
    </div>
  )
}