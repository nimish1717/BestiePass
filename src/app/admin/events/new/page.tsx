"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Save, Copy, Download, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase";

type EventType = "fixed" | "flexible";

export default function NewEventPage() {
  const router = useRouter();
  const [eventType, setEventType] = useState<EventType>("fixed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    personalized_message: "",
    cover_emoji: "💌",
    fixed_date: new Date(),
    fixed_start_time: "18:00",
    fixed_end_time: "21:00",
    range_start_date: new Date(),
    range_end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    allowed_start_time: "10:00",
    allowed_end_time: "22:00",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newEventId = "evt_" + Math.random().toString(36).substring(7);
      
      const newEvent = {
        id: newEventId,
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        personalized_message: formData.personalized_message,
        cover_emoji: formData.cover_emoji,
        type: eventType,
        fixed_date: formData.fixed_date ? format(formData.fixed_date, 'yyyy-MM-dd') : null,
        fixed_start_time: formData.fixed_start_time,
        fixed_end_time: formData.fixed_end_time,
        range_start_date: formData.range_start_date ? format(formData.range_start_date, 'yyyy-MM-dd') : null,
        range_end_date: formData.range_end_date ? format(formData.range_end_date, 'yyyy-MM-dd') : null,
        allowed_start_time: formData.allowed_start_time,
        allowed_end_time: formData.allowed_end_time,
      };

      // Save to Supabase
      const { error } = await supabase.from('events').insert([newEvent]);
      if (error) throw error;
      
      const url = `${window.location.origin}/invite/${newEventId}`;
      setCreatedUrl(url);
      
      toast.success("Event created successfully! 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (createdUrl) {
      navigator.clipboard.writeText(createdUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  if (createdUrl) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center bg-background/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-none shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading text-primary">Event Created! ✨</CardTitle>
              <CardDescription>Your BestiePass is ready to share.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-2xl shadow-inner">
                <QRCodeSVG value={createdUrl} size={200} level="H" includeMargin={true} />
              </div>
              <div className="w-full flex space-x-2">
                <Input value={createdUrl} readOnly className="bg-white/50 border-white/40" />
                <Button onClick={copyToClipboard} variant="secondary" className="shrink-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white" onClick={() => router.push('/admin/dashboard')}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Create New Event</h1>
            <p className="text-muted-foreground">Set up a new hangout with your bestie.</p>
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
                    placeholder="e.g. Coffee & Catchup ☕️" 
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
                    placeholder="What are we doing?"
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
                      placeholder="e.g. Central Perk" 
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
                        <div className="bg-white/60 p-4 rounded-xl border border-white/40 flex justify-center">
                          <Calendar
                            mode="range"
                            selected={{
                              from: formData.range_start_date,
                              to: formData.range_end_date,
                            }}
                            onSelect={(range) => {
                              if (range?.from) {
                                setFormData({
                                  ...formData,
                                  range_start_date: range.from,
                                  range_end_date: range.to || range.from
                                });
                              }
                            }}
                            className="bg-transparent pointer-events-auto"
                          />
                        </div>
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
                    placeholder="Can't wait to see you!"
                    className="w-full rounded-md border border-white/40 bg-white/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[80px]"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-6 shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
                {!isSubmitting && <Save className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
