"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  ...props
}: HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}