"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  // Initialize touch device check only on client
  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return true;
    return "ontouchstart" in window;
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring animation for the glow
  const springConfig = { damping: 30, stiffness: 200 };
  const glowX = useSpring(cursorX, springConfig);
  const glowY = useSpring(cursorY, springConfig);
  
  // Secondary glow with different spring settings
  const secondarySpringConfig = { damping: 40, stiffness: 150 };
  const glowX2 = useSpring(cursorX, secondarySpringConfig);
  const glowY2 = useSpring(cursorY, secondarySpringConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
  }, [cursorX, cursorY]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouchDevice, handleMouseMove, handleMouseLeave]);

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Primary glow - emerald */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
        }}
      />
      
      {/* Secondary glow - cyan, slightly offset and delayed */}
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          x: glowX2,
          y: glowY2,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
