"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const words = [
  "Gathering Information",
  "Organizing What Matters",
  "Making Connections",
  "Refining the Details",
  "Preparing Your View"
]

const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.75,
    transition: { duration: 1, delay: 0.2 },
  },
}
const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: "-100vh",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
}

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
 
  const [index, setIndex] = useState(0)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const [isExiting, setIsExiting] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    if (index === words.length - 1) {
      // After showing the last workflow phrase, slide up the dark screen
      setTimeout(() => {
        setIsExiting(true)
        // Show welcome screen after slide begins
        setTimeout(() => {
          setShowWelcome(true)
          // After 2 seconds on welcome screen, redirect
          setTimeout(() => {
            onComplete?.()
          }, 2000)
        }, 300)
      }, 600) // Brief pause on last phrase before sliding up
      return
    }

    // Consistent cycling through phrases
    setTimeout(
      () => {
        setIndex(index + 1)
      },
      800, // Consistent delay between all phrases
    )
  }, [index, onComplete])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  }


  return (
    <>
      {/* White welcome screen (underneath) */}
      {showWelcome && (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-white z-[99999999998]">
          <div className="flex flex-col items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-black text-4xl md:text-5xl lg:text-6xl font-medium"
            >
              Welcome, Gordon
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-600 text-lg md:text-xl"
            >
              Everything's in place. You're now ready to begin.
            </motion.p>
          </div>
        </div>
      )}
      
      {/* Dark loading screen (on top, slides up) */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
        className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black z-[99999999999]"
      >
        {dimension.width > 0 && (
          <>
                          <motion.p
                variants={opacity}
                initial="initial"
                animate="enter"
                className="text-white text-4xl md:text-5xl lg:text-6xl absolute z-10 font-medium flex items-center"
              >
                {words[index]}
                <span className="ml-2 flex space-x-1">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse [animation-delay:0.2s]">.</span>
                  <span className="animate-pulse [animation-delay:0.4s]">.</span>
                </span>
              </motion.p>
            <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
              <motion.path variants={curve} initial="initial" animate={isExiting ? "exit" : "initial"} fill="#070b13" />
            </svg>
          </>
        )}
      </motion.div>
    </>
  );
};

