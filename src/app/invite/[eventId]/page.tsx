"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Sparkles, CalendarDays, MapPin, Clock, Volume2, VolumeX, Moon, Sun } from "lucide-react";
import useSound from "use-sound";

import { DeclineFlow } from "@/components/invite/DeclineFlow";
import { SuccessScreen } from "@/components/invite/SuccessScreen";
import { DigitalPass } from "@/components/invite/DigitalPass";
import { FloatingBackground } from "@/components/ui/floating-background";
import { supabase } from "@/lib/supabase";

import { Event, RSVP, submitRSVP } from "@/lib/events";
import { format } from "date-fns";

const mockEvent: Event = {
  id: 'example-event-id',
  title: "Coffee & Catchup! ☕️",
  description: "It's been way too long! Let's grab some coffee and pastries and talk about everything.",
  type: "flexible",
  venue: "The Local Roastery, Downtown",
  personalized_message: "Can't wait to hear about your trip!",
  cover_emoji: "🥐",
  created_at: new Date().toISOString()
};

export default function InvitePage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpState, setRsvpState] = useState<'pending' | 'success'>('pending');
  const [rsvpData, setRsvpData] = useState<RSVP | null>(null);
  
  const [showDecline, setShowDecline] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("12:00");
  
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (data) {
        setEvent(data);
      } else {
        // Fallback to mock event for testing
        setEvent(mockEvent);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleConfirm = async () => {
    if (!event) return;

    if (event.type === 'flexible') {
      const allowedStart = event.allowed_start_time || "00:00";
      const allowedEnd = event.allowed_end_time || "23:59";
      if (selectedTime < allowedStart || selectedTime > allowedEnd) {
        alert(`Please select a time between ${allowedStart} and ${allowedEnd}`);
        return;
      }
    }

    const newRsvp: Partial<RSVP> = {
      event_id: event.id,
      guest_name: "Bestie",
      status: "confirmed",
      selected_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
      selected_start_time: selectedTime,
    };

    const savedRsvp = await submitRSVP(newRsvp);
    if (savedRsvp) {
      setRsvpData(savedRsvp);
    } else {
      // Fallback for local testing if DB fails
      setRsvpData({ ...newRsvp, id: 'temp-id', responded_at: new Date().toISOString() } as RSVP);
    }

    setRsvpState('success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🌸
          </motion.div>
          <div className="w-48 h-4 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!event) return <div>Event not found</div>;

  return (
    <main className="relative min-h-screen flex flex-col items-center py-12 px-4 overflow-x-hidden">
      <FloatingBackground />

      {/* Top Bar Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="rounded-full bg-white/20 backdrop-blur-md">
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full bg-white/20 backdrop-blur-md">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {rsvpState === 'pending' ? (
          <motion.div 
            key="invite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 glass-card max-w-md w-full p-6 md:p-8 rounded-[2.5rem] shadow-2xl flex flex-col"
          >
            <div className="text-center mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="text-7xl mb-4 drop-shadow-lg inline-block cursor-pointer"
              >
                {event.cover_emoji}
              </motion.div>
              <h1 className="text-3xl font-bold font-heading text-primary mb-2">{event.title}</h1>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <div className="space-y-4 mb-8 bg-white/40 dark:bg-black/20 p-5 rounded-3xl">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Venue</p>
                  <p className="text-sm text-muted-foreground">{event.venue}</p>
                </div>
              </div>
              
              {event.type === 'fixed' ? (
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Date & Time</p>
                    <p className="text-sm text-muted-foreground">{event.fixed_date} at {event.fixed_start_time}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-border">
                  <p className="font-semibold text-sm mb-2">Pick a date & time:</p>
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-2 flex flex-col items-center gap-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        if (!event.range_start_date || !event.range_end_date) return false;
                        const start = new Date(event.range_start_date);
                        start.setHours(0, 0, 0, 0);
                        const end = new Date(event.range_end_date);
                        end.setHours(23, 59, 59, 999);
                        return date < start || date > end;
                      }}
                      className="rounded-md"
                    />
                    {selectedDate && (
                      <div className="w-full px-4 pb-2">
                        <label className="text-xs text-muted-foreground mb-1 block">What time works best?</label>
                        <input 
                          type="time" 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          min={event.allowed_start_time || "00:00"}
                          max={event.allowed_end_time || "23:59"}
                          className="w-full bg-muted border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  onClick={handleConfirm}
                  disabled={event.type === 'flexible' && !selectedDate}
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg"
                >
                  I'm Coming! 🎉
                </Button>
              </motion.div>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowDecline(true)}
                className="w-full rounded-full text-muted-foreground hover:bg-muted"
              >
                Can't Make It 😢
              </Button>
            </div>

            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSurprise(true)}
                className="rounded-full text-xs font-semibold"
              >
                <Sparkles className="mr-2 h-3 w-3 text-accent-foreground" />
                Surprise me 🎁
              </Button>
            </div>
          </motion.div>
        ) : (
          <SuccessScreen 
            key="success"
            event={event} 
            guestName="Bestie" 
            onGetPass={() => setShowPass(true)} 
          />
        )}
      </AnimatePresence>

      <DeclineFlow isOpen={showDecline} onClose={() => setShowDecline(false)} />
      
      {showPass && (
        <DigitalPass event={event} rsvp={rsvpData} onClose={() => setShowPass(false)} />
      )}

      {/* Surprise Modal */}
      <AnimatePresence>
        {showSurprise && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowSurprise(false)}
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }} 
              animate={{ scale: 1, rotate: 0 }} 
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-accent text-accent-foreground p-8 rounded-[3rem] shadow-2xl max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">✨</div>
              <p className="text-xl font-bold font-heading mb-6 leading-relaxed">
                You are simply amazing and I appreciate you so much! 💖
              </p>
              <Button variant="secondary" onClick={() => setShowSurprise(false)} className="rounded-full">
                Aww, thanks!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
