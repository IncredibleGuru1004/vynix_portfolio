import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface UseUserAvatarReturn {
  avatarImage: string | null
  isLoading: boolean
  error: string | null
}

export const useUserAvatar = (userId?: string): UseUserAvatarReturn => {
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvatarImage = async () => {
      if (!userId) {
        setAvatarImage(null)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        // First, get the admin user document to check if they have a teamRegistrationId
        const adminUserRef = doc(db, 'adminUsers', userId)
        const adminUserSnap = await getDoc(adminUserRef)
        
        if (adminUserSnap.exists()) {
          const adminUserData = adminUserSnap.data()
          
          // If this admin user was created from a team registration, fetch the avatar
          if (adminUserData?.teamRegistrationId) {
            const teamRegRef = doc(db, 'teamRegistrations', adminUserData.teamRegistrationId)
            const teamRegSnap = await getDoc(teamRegRef)
            
            if (teamRegSnap.exists()) {
              const teamRegData = teamRegSnap.data()
              if (teamRegData?.avatar) {
                setAvatarImage(teamRegData.avatar)
              } else {
                setAvatarImage(null)
              }
            } else {
              setAvatarImage(null)
            }
          } else {
            setAvatarImage(null)
          }
        } else {
          setAvatarImage(null)
        }
      } catch (err) {
        console.error('Error fetching avatar image:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch avatar')
        setAvatarImage(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvatarImage()
  }, [userId])

  return { avatarImage, isLoading, error }
}
