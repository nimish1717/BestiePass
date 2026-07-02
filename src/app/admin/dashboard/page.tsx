"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, LogOut, Link as LinkIcon, Trash2, CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/lib/events";

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      
      if (data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    await supabase.from('events').delete().eq('id', id);
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
  };

  const getFilteredEvents = () => {
    const now = new Date();
    return events.filter(e => {
      // Very simple past/upcoming heuristic based on created_at for flexible events or fixed_date for fixed
      const eventDate = e.fixed_date ? new Date(e.fixed_date) : new Date(e.created_at);
      // Give it a 1 day buffer to be safe
      eventDate.setDate(eventDate.getDate() + 1);
      
      if (filter === 'upcoming') {
        return eventDate >= now;
      } else {
        return eventDate < now;
      }
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <main className="min-h-screen bg-background/50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your hangout invitations.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 border-b border-border w-full pb-2">
            <button 
              onClick={() => setFilter("upcoming")}
              className={`font-semibold pb-2 ${filter === 'upcoming' ? 'text-primary border-b-2 border-primary -mb-[9px]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setFilter("past")}
              className={`font-semibold pb-2 ${filter === 'past' ? 'text-primary border-b-2 border-primary -mb-[9px]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Past
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading events...</div>
        ) : (
          <div className="grid gap-4">
            {filteredEvents.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel border-none">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl bg-white/50 dark:bg-black/20 p-3 rounded-2xl">
                      {event.cover_emoji || '🎫'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        {event.title}
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {event.type}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {event.type === 'fixed' ? event.fixed_date : 'Flexible Date'}
                      </p>
                      <div className="flex gap-3 text-xs font-medium">
                        <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">1 Confirmed</span>
                        <span className="text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">0 Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 justify-end mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/invite/${event.id}`)}>
                      <LinkIcon className="h-3 w-3 mr-2" /> Copy Link
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-20 bg-muted/50 rounded-3xl border border-dashed border-border">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-bold mb-2">No events here</h3>
                <p className="text-muted-foreground mb-6">Create your first hangout invitation!</p>
              </div>
            )}
          </div>
        )}

        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="icon" 
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-primary/50"
            onClick={() => router.push('/admin/events/new')}
          >
            <Plus className="h-8 w-8" />
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
