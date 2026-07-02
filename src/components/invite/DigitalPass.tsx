"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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

  const downloadImage = async () => {
    if (!passRef.current) return;
    const canvas = await html2canvas(passRef.current, { scale: 2, backgroundColor: null });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-pass.png`;
    link.click();
  };

  const downloadPDF = async () => {
    if (!passRef.current) return;
    const canvas = await html2canvas(passRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${event.title.replace(/\s+/g, '-').toLowerCase()}-pass.pdf`);
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
          className="bg-gradient-to-br from-primary to-accent p-1 rounded-[3rem] shadow-2xl mb-8 w-full max-w-sm"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-[2.8rem] p-8 flex flex-col items-center text-center">
            <div className="text-6xl mb-4">{event.cover_emoji || '🎫'}</div>
            <h2 className="text-2xl font-bold font-heading text-primary mb-2">{event.title}</h2>
            
            <div className="w-full h-px bg-border my-6 border-dashed border-2" />
            
            <div className="w-full text-left space-y-4 mb-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Guest</p>
                <p className="font-semibold">{rsvp?.guest_name || 'VIP Guest'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">When</p>
                <p className="font-semibold">{event.type === 'fixed' ? event.fixed_date : rsvp?.selected_date || 'TBD'}</p>
                <p className="text-sm text-muted-foreground">{event.type === 'fixed' ? event.fixed_start_time : rsvp?.selected_start_time || 'TBD'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Where</p>
                <p className="font-semibold">{event.venue}</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-3xl">
              <QRCodeSVG 
                value={`https://hangout-invite.vercel.app/invite/${event.id}/pass`} 
                size={120} 
                level="H" 
                includeMargin={false} 
                className="rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 tracking-widest uppercase">Digital Pass</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 w-full max-w-sm">
        <Button onClick={downloadImage} className="flex-1 rounded-full shadow-lg" variant="secondary">
          <ImageIcon className="mr-2 h-4 w-4" /> Image
        </Button>
        <Button onClick={downloadPDF} className="flex-1 rounded-full shadow-lg" variant="default">
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
      </div>
    </motion.div>
  );
}
