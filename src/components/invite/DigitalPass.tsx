"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, X, Loader2, MapPin, Calendar, Clock, Coffee } from "lucide-react";
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
        className="w-full max-w-[360px]"
      >
        {/* Pass Card to be captured */}
        <div 
          ref={passRef}
          style={{ 
            backgroundColor: "#ff9dbb", 
            padding: '12px', 
            borderRadius: '24px',
            fontFamily: "'Quicksand', system-ui, -apple-system, sans-serif"
          }}
          className="shadow-2xl mb-6 relative overflow-hidden"
        >
          <div 
            style={{ 
              backgroundColor: '#ffe5ec', 
              borderRadius: '16px', 
              padding: '24px',
              border: '2px dashed #ff9dbb',
              position: 'relative'
            }} 
            className="flex flex-col items-center"
          >
            {/* Header */}
            <div style={{ color: '#d8587d', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '12px' }}>
              ⭐ ENTRY PASS ⭐
            </div>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ color: '#d8587d', fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.1, textAlign: 'center' }}>
                PLAN<br/>Unlocked
              </h2>
              <span style={{ fontSize: '1.8rem' }}>🔓</span>
            </div>
            
            <p style={{ color: '#d8587d', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '24px' }}>
              MEMORIES AWAIT!
            </p>

            {/* Panda Centerpiece */}
            <div 
              style={{
                width: '140px',
                height: '140px',
                backgroundColor: '#ffb3c6',
                borderRadius: '50%',
                border: '6px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(216, 88, 125, 0.2)',
                marginBottom: '28px',
                position: 'relative'
              }}
            >
              {/* Cute sparkles around panda */}
              <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '1.2rem' }}>✨</span>
              <span style={{ position: 'absolute', bottom: '15px', right: '15px', fontSize: '1rem' }}>💖</span>
              <span style={{ fontSize: '5rem', lineHeight: 1, filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))' }}>
                🐼
              </span>
            </div>

            {/* Details & QR Code Row */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              
              {/* Left Column: Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                
                {/* Event */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#ff7aa2', marginTop: '2px' }}><Coffee size={14} strokeWidth={3} /></div>
                  <div>
                    <p style={{ fontSize: '0.6rem', color: '#ff7aa2', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Event</p>
                    <p style={{ color: '#d8587d', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{event.title}</p>
                  </div>
                </div>

                {/* Date */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#ff7aa2', marginTop: '2px' }}><Calendar size={14} strokeWidth={3} /></div>
                  <div>
                    <p style={{ fontSize: '0.6rem', color: '#ff7aa2', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Date</p>
                    <p style={{ color: '#d8587d', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
                      {event.type === 'fixed' ? event.fixed_date : rsvp?.selected_date || 'TBD'}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#ff7aa2', marginTop: '2px' }}><Clock size={14} strokeWidth={3} /></div>
                  <div>
                    <p style={{ fontSize: '0.6rem', color: '#ff7aa2', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Time</p>
                    <p style={{ color: '#d8587d', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
                      {event.type === 'fixed' ? event.fixed_start_time : rsvp?.selected_start_time || 'TBD'}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                {event.venue && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ color: '#ff7aa2', marginTop: '2px' }}><MapPin size={14} strokeWidth={3} /></div>
                    <div>
                      <p style={{ fontSize: '0.6rem', color: '#ff7aa2', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Venue</p>
                      <p style={{ color: '#d8587d', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{event.venue}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: QR Code */}
              <div style={{ backgroundColor: '#ffffff', padding: '6px', borderRadius: '12px', border: '2px solid #ffb3c6', boxShadow: '0 4px 8px rgba(216, 88, 125, 0.1)' }}>
                <QRCodeCanvas 
                  value={`https://hangout-invite.vercel.app/invite/${event.id}/pass`} 
                  size={80} 
                  level="M" 
                  includeMargin={false} 
                  style={{ borderRadius: '6px' }}
                />
              </div>

            </div>

            <div style={{ width: '100%', height: '2px', backgroundColor: '#ffb3c6', margin: '20px 0', opacity: 0.5 }} />

            <div style={{ color: '#ff7aa2', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              THANK YOU FOR SAYING YES! 💖
            </div>

          </div>
        </div>

        <div className="flex gap-4 w-full">
          <Button onClick={downloadImage} disabled={isDownloading} className="flex-1 rounded-full shadow-lg" style={{ backgroundColor: '#ff9dbb', color: 'white' }}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />} Image
          </Button>
          <Button onClick={downloadPDF} disabled={isDownloading} className="flex-1 rounded-full shadow-lg" style={{ backgroundColor: '#d8587d', color: 'white' }}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} PDF
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
