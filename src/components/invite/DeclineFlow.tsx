"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DeclineFlow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [declineClicks, setDeclineClicks] = useState(0);

  const handleDecline = () => {
    if (declineClicks === 0) {
      setDeclineClicks(1);
    } else {
      // Force confirm on 2nd attempt inside the modal
      onClose();
      // Optional: you could show a toast saying "You can't escape! 💖"
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-md w-full p-8 rounded-3xl text-center shadow-2xl relative"
          >
            <motion.div 
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-8xl mb-6"
            >
              🥺
            </motion.div>
            <h2 className="text-2xl font-bold font-heading mb-4 text-foreground">Are you absolutely sure?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {declineClicks === 0 ? "The organizer will be very sad 😔" : "Are you REALLY sure? Because I won't let you! 😭"}
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                size="lg"
                onClick={onClose}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg hover:shadow-primary/50"
              >
                Okay, I'll Come 💖
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleDecline}
                className="rounded-full text-muted-foreground hover:bg-muted"
              >
                {declineClicks === 0 ? "Still Can't Make It 😅" : "I really can't! 🏃‍♂️"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
