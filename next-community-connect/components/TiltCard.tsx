"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // how many degrees of tilt, default 12
  glareOpacity?: number; // 0–1, default 0.18
}

export default function TiltCard({
  children,
  className = "",
  intensity = 12,
  glareOpacity = 0.18,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Spring config — tight & snappy like the reference site
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };

  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Normalize -1 to 1
      const normX = mouseX / (rect.width / 2);
      const normY = mouseY / (rect.height / 2);

      rotateY.set(normX * intensity);
      rotateX.set(-normY * intensity);

      // Glare position as percentage
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      setGlarePos({ x: glareX, y: glareY });
    },
    [intensity, rotateX, rotateY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    scale.set(1.04);
  }, [scale]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative cursor-pointer ${className}`}
    >
      {/* The actual card content */}
      <div style={{ transform: "translateZ(0px)" }}>{children}</div>

      {/* Glare overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 65%)`,
            zIndex: 10,
            borderRadius: "inherit",
          }}
        />
      )}
    </motion.div>
  );
}
