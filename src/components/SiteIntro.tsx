import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Full-screen intro overlay shown once on initial page load.
 * Logo fades and scales in, then the overlay scales up slightly and fades out,
 * creating a cinematic "zoom into the hero" transition.
 */
export const SiteIntro = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-violet-ray"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden
        >
          <motion.img
            src="/brand/dreamlabs-intro-logo.png"
            alt=""
            className="w-56 h-auto object-contain"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
