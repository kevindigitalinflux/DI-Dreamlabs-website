import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Full-screen violet-ray intro overlay shown once on initial page load.
 * Covers the hero video and canvas while they initialise, then fades out
 * in 300 ms — keeping the first impression clean rather than janky.
 */
export const SiteIntro = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-violet-ray"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          aria-hidden
        >
          <motion.img
            src="/brand/logo-primary-on-dark.png"
            alt=""
            className="h-14 w-auto"
            width={250}
            height={70}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
