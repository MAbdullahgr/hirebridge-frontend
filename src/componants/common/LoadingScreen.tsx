'use client'

import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100'>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: 'linear',
        }}
        className='relative w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full shadow-lg'
      >
        {/* Glowing inner circle */}
        <motion.div
          className='absolute inset-2 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-md'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <motion.p
        className='mt-6 text-lg font-semibold text-gray-700'
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading, please wait...
      </motion.p>
    </div>
  )
}

export default LoadingScreen
