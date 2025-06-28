import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#6244FF] via-[#6244FF] to-[#4F37CC] text-white hover:from-[#4F37CC] hover:via-[#4F37CC] hover:to-[#3D2BA3] focus:ring-[#6244FF] shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#6244FF] text-[#6244FF] hover:bg-[#6244FF] hover:text-white focus:ring-[#6244FF] transition-colors',
    ghost: 'text-gray-300 hover:bg-gray-700 focus:ring-gray-500'
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
      
      {/* Subtle shine effect for primary buttons */}
      {variant === 'primary' && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      )}
    </button>
  )
}