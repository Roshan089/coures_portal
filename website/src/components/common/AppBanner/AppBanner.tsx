'use client'

import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import Image from 'next/image'
// Import images directly
import ApplicantBanner from './ApplicantBanner.png'
import Background from './background.png'

export function AppBanner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Use imported images directly
  const images = [
    ApplicantBanner,
    Background
  ]

  const goToNextSlide = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }, [images.length])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAutoPlaying) {
      timer = setInterval(goToNextSlide, 5000) // Change slide every 5 seconds
    }
    return () => clearInterval(timer)
  }, [isAutoPlaying, goToNextSlide])

  return (
    <Box
      sx={{
        borderRadius: 3,
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        height: {
          xs: '200px',
          sm: '300px',
          md: '400px',
          lg: '300px'
        },
        overflow: 'hidden',
        mx: 'auto',
        mb: 2
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {images.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: index === currentImageIndex ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <Image
            src={image}
            alt={`Slide ${index + 1}`}
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            priority={index === 0}
          />
        </Box>
      ))}
    </Box>
  )
}

export default AppBanner