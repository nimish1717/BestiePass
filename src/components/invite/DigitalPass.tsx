"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Event, RSVP } from "@/lib/events";

interface DigitalPassProps {
  event: Event;
  rsvp?: RSVP | null;
  onClose: () => void;
}

export function DigitalPass({ event, rsvp, onClose }: DigitalPassProps) {
  const passRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = async () => {
    if (!passRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(passRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-pass.png`;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPDF = async () => {
    if (!passRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(passRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${event.title.replace(/\s+/g, '-').toLowerCase()}-pass.pdf`);
    } catch (err) {
      console.error("Failed to download pdf", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

      <motion.div
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        {/* Pass Card to be captured */}
        <div 
          ref={passRef}
          className="bg-gradient-to-br from-primary via-accent to-primary/80 p-1.5 rounded-[3rem] shadow-2xl mb-8 w-full max-w-sm"
        >
          <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl rounded-[2.8rem] p-8 flex flex-col items-center text-center shadow-inner relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <div className="text-6xl mb-4 relative z-10 drop-shadow-md">{event.cover_emoji || '🎫'}</div>
            <h2 className="text-2xl font-bold font-heading text-primary mb-2 relative z-10">{event.title}</h2>
            
            <div className="w-full h-px bg-border my-6 border-dashed border-2 relative z-10 opacity-50" />
            
            <div className="w-full text-left space-y-5 mb-8 relative z-10">
              <div className="bg-muted/30 p-3 rounded-2xl">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Guest</p>
                <p className="font-semibold text-lg">{rsvp?.guest_name || 'VIP Guest'}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-2xl">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">When</p>
                <p className="font-semibold">{event.type === 'fixed' ? event.fixed_date : rsvp?.selected_date || 'Date Pending'}</p>
                <p className="text-sm text-foreground/80 font-medium">{event.type === 'fixed' ? event.fixed_start_time : rsvp?.selected_start_time || 'Time Pending'}</p>
              </div>
              {event.venue && (
                <div className="bg-muted/30 p-3 rounded-2xl">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Where</p>
                  <p className="font-semibold leading-tight">{event.venue}</p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-border/50 relative z-10">
              <QRCodeCanvas 
                value={`https://hangout-invite.vercel.app/invite/${event.id}/pass`} 
                size={110} 
                level="H" 
                includeMargin={false} 
                className="rounded-xl"
              />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground mt-5 tracking-[0.2em] uppercase relative z-10">VIP Digital Pass</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 w-full max-w-sm">
        <Button onClick={downloadImage} disabled={isDownloading} className="flex-1 rounded-full shadow-lg" variant="secondary">
          {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />} Image
        </Button>
        <Button onClick={downloadPDF} disabled={isDownloading} className="flex-1 rounded-full shadow-lg" variant="default">
          {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} PDF
        </Button>
      </div>
    </motion.div>
  );
}
