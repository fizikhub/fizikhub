"use client";

import { m as motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        mass: 0.5
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
