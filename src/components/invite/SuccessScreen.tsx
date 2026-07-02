"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { FloatingBackground } from "@/components/ui/floating-background";
import type { Event } from "@/lib/events";

interface SuccessScreenProps {
  event: Event;
  guestName: string;
  onGetPass: () => void;
}

export function SuccessScreen({ event, guestName, onGetPass }: SuccessScreenProps) {
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card max-w-md w-full p-8 md:p-10 rounded-[2.5rem] text-center shadow-2xl relative z-10 mx-auto mt-20"
    >
      <FloatingBackground />
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold font-heading mb-4 text-primary">Yay {guestName || 'Bestie'}!</h2>
      <p className="text-xl mb-6 text-foreground font-medium">
        Can't wait to see you! 💕
      </p>
      
      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-3xl mb-8 text-left shadow-inner border border-white/20">
        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
          {event.cover_emoji || '💌'} {event.title}
        </h3>
        {event.venue && (
          <p className="text-sm text-foreground/80 mb-2 flex items-center gap-2">
            <span>📍</span> {event.venue}
          </p>
        )}
        <p className="text-sm text-foreground/80 flex items-center gap-2">
          <span>📅</span> {event.type === 'fixed' ? event.fixed_date : 'Flexible Date'} 
        </p>
      </div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          size="lg"
          onClick={onGetPass}
          className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Get My Digital Pass ✨
        </Button>
      </motion.div>
    </motion.div>
  );
}
