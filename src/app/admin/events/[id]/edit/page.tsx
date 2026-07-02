"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";

type EventType = "fixed" | "flexible";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [eventType, setEventType] = useState<EventType>("fixed");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "Movie Night 🍿",
    description: "Let's watch a movie!",
    venue: "My Place",
    personalized_message: "Can't wait!",
    cover_emoji: "🍿",
    fixed_date: new Date(),
    fixed_start_time: "19:00",
    fixed_end_time: "22:00",
    range_start_date: new Date(),
    range_end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    allowed_start_time: "10:00",
    allowed_end_time: "22:00",
  });

  useEffect(() => {
    // Simulate fetching the event details
    toast.info("Loaded event details for " + eventId);
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Event updated successfully! 🎉");
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error("Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Edit Event</h1>
            <p className="text-muted-foreground">Update your hangout details.</p>
          </div>
        </div>

        <Card className="glass-card border-none shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex bg-secondary/50 p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setEventType("fixed")}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    eventType === "fixed" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Fixed Event
                </button>
                <button
                  type="button"
                  onClick={() => setEventType("flexible")}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    eventType === "flexible" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Flexible Event
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                  <Input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    className="bg-white/50 border-white/40 focus-visible:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-md border border-white/40 bg-white/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Venue</label>
                    <Input 
                      name="venue" 
                      value={formData.venue} 
                      onChange={handleChange} 
                      className="bg-white/50 border-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Cover Emoji</label>
                    <Input 
                      name="cover_emoji" 
                      value={formData.cover_emoji} 
                      onChange={handleChange} 
                      className="bg-white/50 border-white/40 text-center text-xl"
                      maxLength={2}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {eventType === "fixed" ? (
                    <motion.div
                      key="fixed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-border/50"
                    >
                      <h3 className="font-medium text-foreground flex items-center"><CalendarIcon className="w-4 h-4 mr-2"/> Fixed Date & Time</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/60 p-4 rounded-xl border border-white/40 flex justify-center">
                          <Calendar
                            mode="single"
                            selected={formData.fixed_date}
                            onSelect={(date) => date && setFormData({ ...formData, fixed_date: date })}
                            className="bg-transparent pointer-events-auto"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Start Time</label>
                            <Input 
                              type="time" 
                              name="fixed_start_time"
                              value={formData.fixed_start_time}
                              onChange={handleChange}
                              className="bg-white/50 border-white/40"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground mb-1 block">End Time</label>
                            <Input 
                              type="time" 
                              name="fixed_end_time"
                              value={formData.fixed_end_time}
                              onChange={handleChange}
                              className="bg-white/50 border-white/40"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="flexible"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-border/50"
                    >
                      <h3 className="font-medium text-foreground flex items-center"><Clock className="w-4 h-4 mr-2"/> Flexible Options</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                          <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Allowed Time Window Start</label>
                            <Input 
                              type="time" 
                              name="allowed_start_time"
                              value={formData.allowed_start_time}
                              onChange={handleChange}
                              className="bg-white/50 border-white/40"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Allowed Time Window End</label>
                            <Input 
                              type="time" 
                              name="allowed_end_time"
                              value={formData.allowed_end_time}
                              onChange={handleChange}
                              className="bg-white/50 border-white/40"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <label className="text-sm font-medium text-foreground mb-1 block">Personalized Message (Optional)</label>
                  <textarea
                    name="personalized_message"
                    value={formData.personalized_message}
                    onChange={handleChange}
                    className="w-full rounded-md border border-white/40 bg-white/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[80px]"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-6 shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
                {!isSubmitting && <Save className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
