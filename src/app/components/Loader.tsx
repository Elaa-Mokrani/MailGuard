import { motion } from "motion/react";

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1120]">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 border-4 border-[rgba(37,99,235,0.2)] border-t-[#2563EB] rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 border-4 border-[rgba(124,58,237,0.2)] border-b-[#7C3AED] rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-3 h-3 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
