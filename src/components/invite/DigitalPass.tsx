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
          style={{ 
            background: "linear-gradient(135deg, #FF6B6B, #FFB88E)", 
            padding: '6px', 
            borderRadius: '2rem',
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}
          className="shadow-2xl mb-8 w-full max-w-sm relative"
        >
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '1.7rem', 
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }} 
            className="flex flex-col items-center text-center"
          >
            {/* Ticket Cutouts (Perforated effect) */}
            <div 
              style={{
                position: 'absolute',
                top: '55%',
                left: '-16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: "linear-gradient(135deg, #FF6B6B, #FF8E53)"
              }}
            />
            <div 
              style={{
                position: 'absolute',
                top: '55%',
                right: '-16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: "linear-gradient(135deg, #FF9E6F, #FFB88E)"
              }}
            />

            <div className="text-6xl mb-4 relative z-10" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
              {event.cover_emoji || '🎫'}
            </div>
            
            <h2 style={{ color: '#FF6B6B', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }} className="font-heading">
              {event.title}
            </h2>
            
            <div style={{ width: '100%', height: '0px', borderTop: '2px dashed #e2e8f0', margin: '1.5rem 0' }} />
            
            <div className="w-full text-left space-y-4 mb-8">
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.25rem' }}>Guest</p>
                <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.125rem' }}>{rsvp?.guest_name || 'VIP Guest'}</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.25rem' }}>When</p>
                <p style={{ color: '#0f172a', fontWeight: 700 }}>{event.type === 'fixed' ? event.fixed_date : rsvp?.selected_date || 'Date Pending'}</p>
                <p style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>{event.type === 'fixed' ? event.fixed_start_time : rsvp?.selected_start_time || 'Time Pending'}</p>
              </div>
              {event.venue && (
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.25rem' }}>Where</p>
                  <p style={{ color: '#0f172a', fontWeight: 600, lineHeight: 1.2 }}>{event.venue}</p>
                </div>
              )}
            </div>

            <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <QRCodeCanvas 
                value={`https://hangout-invite.vercel.app/invite/${event.id}/pass`} 
                size={110} 
                level="H" 
                includeMargin={false} 
                style={{ borderRadius: '0.5rem' }}
              />
            </div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginTop: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              VIP Digital Pass
            </p>
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
