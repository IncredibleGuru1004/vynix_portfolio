'use client'

import { useState } from 'react'
import { User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  fallbackIcon?: React.ComponentType<{ className?: string }>
  className?: string
  showStatus?: boolean
  status?: 'online' | 'offline' | 'busy' | 'away'
  statusColor?: string
  roleIcon?: React.ComponentType<{ className?: string }>
  roleIconColor?: string
  onClick?: () => void
  loading?: boolean
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-24 h-24 text-2xl'
}

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500'
}

const statusSizes = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
  '2xl': 'w-6 h-6'
}

export const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  fallbackIcon: FallbackIcon = User,
  className,
  showStatus = false,
  status = 'offline',
  statusColor,
  roleIcon: RoleIcon,
  roleIconColor = 'from-blue-500 to-blue-600',
  onClick,
  loading = false
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  const isClickable = !!onClick

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center',
          sizeClasses[size],
          isClickable && 'cursor-pointer hover:opacity-80 transition-opacity',
          'bg-gray-100 border-2 border-white shadow-lg'
        )}
        onClick={onClick}
      >
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <Loader2 className="w-1/2 h-1/2 animate-spin text-gray-400" />
          </div>
        ) : src && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader2 className="w-1/2 h-1/2 animate-spin text-gray-400" />
              </div>
            )}
            <img
              src={src}
              alt={alt || name || 'Avatar'}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </>
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center text-white font-semibold',
            name ? getRandomColor(name) : 'bg-gray-500'
          )}>
            {name ? getInitials(name) : <FallbackIcon className="w-1/2 h-1/2" />}
          </div>
        )}

      </div>

      {/* Role Icon Overlay - Outside the circular container */}
      {RoleIcon && !loading && (
        <div className={cn(
          'absolute rounded-full flex items-center justify-center shadow-lg border-2 border-white',
          // Position outside the circle at bottom-right
          'bottom-0 right-0',
          size === 'xs' || size === 'sm' ? 'w-4 h-4' :
          size === 'md' ? 'w-5 h-5' :
          size === 'lg' ? 'w-6 h-6' :
          size === 'xl' ? 'w-7 h-7' : 'w-8 h-8',
          `bg-gradient-to-r ${roleIconColor}`
        )}>
          <RoleIcon className={cn(
            'text-white',
            size === 'xs' || size === 'sm' ? 'w-2 h-2' :
            size === 'md' ? 'w-2.5 h-2.5' :
            size === 'lg' ? 'w-3 h-3' :
            size === 'xl' ? 'w-3.5 h-3.5' : 'w-4 h-4'
          )} />
        </div>
      )}

      {/* Status Indicator - Outside the circular container */}
      {showStatus && !loading && (
        <div className={cn(
          'absolute rounded-full border-2 border-white',
          // Position at top-right corner to avoid overlap with role icon
          'top-0 right-0',
          statusSizes[size],
          statusColor || statusClasses[status]
        )} />
      )}
    </div>
  )
}

export default Avatar
