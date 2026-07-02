"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const shapes = ["💖", "✨", "🌟", "🌸", "🦋", "🎀"];

export function FloatingBackground() {
  const [elements, setElements] = useState<{ id: number; shape: string; left: number; top: number; delay: number }[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: "100vh", opacity: 0, x: `${el.left}vw` }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.8, 0],
            x: [`${el.left}vw`, `${el.left + (Math.random() * 10 - 5)}vw`],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear",
          }}
          className="absolute text-3xl opacity-50 drop-shadow-md"
        >
          {el.shape}
        </motion.div>
      ))}
    </div>
  );
}
