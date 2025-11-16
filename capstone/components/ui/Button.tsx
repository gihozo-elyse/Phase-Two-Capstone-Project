import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'golden'
    | 'outline-golden'
    | 'ghost-dark'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    default: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-green-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-green-500',
    golden:
      'bg-yellow-500 text-black hover:bg-yellow-400 focus:ring-yellow-500 font-semibold',
    'outline-golden':
      'border-2 border-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500/10 focus:ring-yellow-500',
    'ghost-dark':
      'text-white hover:bg-gray-800 focus:ring-yellow-500 bg-transparent',
  }

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-8 text-lg',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

