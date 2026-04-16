"use client";

import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] w-full bg-background/50">
      <div className="relative flex flex-col items-center">
        {/* Animated Brand Icon */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ 
             opacity: [0.4, 1, 0.4],
             scale: [0.95, 1, 0.95],
           }}
           transition={{
             duration: 2,
             repeat: Infinity,
             ease: "easeInOut"
           }}
           className="relative mb-6"
        >
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-2xl border border-primary/20">
            <Icons.notebook
              weight="fill"
              className="text-primary w-8 h-8"
            />
          </div>
          
          {/* Scanning line effect */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-0.5 bg-primary/40 shadow-[0_0_8px_rgba(255,155,102,0.5)]"
            animate={{
              top: ["0%", "100%", "0%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Loading Text with character animation */}
        <div className="flex flex-col items-center space-y-3">
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-black text-[10px] uppercase tracking-[0.4em] text-foreground/40"
          >
            Loading Drop
          </motion.span>
          
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
