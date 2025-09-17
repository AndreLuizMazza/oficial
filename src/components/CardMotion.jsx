import { motion, useReducedMotion } from "framer-motion"

export default function CardMotion({ children, className = "", ...rest }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      whileHover={reduce ? {} : { y: -2, scale: 1.01 }}
      whileFocus={reduce ? {} : { y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.55 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
