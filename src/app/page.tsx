"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FloatingBackground } from "@/components/ui/floating-background";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const quotes = [
  "You're the peanut butter to my jelly! 🥜🍇",
  "Life is better with you in it! 💖",
  "Ready for our next adventure? 🗺️✨",
  "Because one bestie hangout is never enough! 👯‍♀️",
  "I couldn't imagine a better partner in crime! 🕵️‍♀️💕",
  "You make my heart smile! 😊🌸",
  "Good times + Crazy friends = Amazing memories! 🎉",
  "A good friend knows all your stories. A best friend helped you write them! 📖🖊️",
  "You're the avocado to my toast! 🥑🍞",
  "You are my sunshine on a cloudy day! ☀️☁️"
];

function LandingContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Bestie";
  const [quote, setQuote] = useState("");
  const router = useRouter();

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <FloatingBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="relative z-10 glass-card p-10 md:p-14 rounded-[2.5rem] flex flex-col items-center text-center max-w-lg w-full mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="text-7xl mb-6 drop-shadow-xl"
        >
          💌
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4 drop-shadow-sm">
          Hey {name}!
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-foreground/80 mb-8 font-medium px-4"
        >
          {quote}
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            size="lg" 
            onClick={() => router.push('/invite/example-event-id')}
            className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold text-lg px-8 py-6 shadow-lg hover:shadow-primary/50 transition-all border-none"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            See your invite
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>}>
      <LandingContent />
    </Suspense>
  );
}
