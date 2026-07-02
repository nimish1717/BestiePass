"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, X, Loader2, MapPin, Calendar, Clock, Ticket } from "lucide-react";
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
        className="w-full max-w-[360px] flex flex-col items-center"
      >
        <div 
          ref={passRef}
          style={{
            position: 'relative',
            width: '320px',
            borderRadius: '30px',
            background: 'linear-gradient(to bottom, #fdf2f8, #fce7f3)',
            border: '10px solid #f9a8d4',
            overflow: 'hidden',
            fontFamily: "'Quicksand', system-ui, -apple-system, sans-serif"
          }}
          className="shadow-2xl mb-6 bg-white"
        >
          {/* Decorative Corners */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', backgroundColor: '#f9a8d4', borderBottomRightRadius: '9999px' }}></div>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', backgroundColor: '#f9a8d4', borderBottomLeftRadius: '9999px' }}></div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', backgroundColor: '#f9a8d4', borderTopRightRadius: '9999px' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', backgroundColor: '#f9a8d4', borderTopLeftRadius: '9999px' }}></div>

          <div style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#be185d', fontWeight: 600, fontSize: '1.125rem' }}>
                ✨ ENTRY PASS ✨
              </h3>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ec4899', marginTop: '8px', lineHeight: 1 }}>
                PLAN
              </h1>
              <h2 style={{ fontSize: '1.875rem', color: '#7e22ce', fontFamily: 'cursive', marginTop: '-4px' }}>
                Unlocked
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px', fontWeight: 600 }}>
                MEMORIES AWAIT!
              </p>
            </div>

            {/* Panda Centerpiece */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '128px', height: '128px', borderRadius: '9999px', backgroundColor: '#fbcfe8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <span style={{ fontSize: '5rem', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))' }}>🐼</span>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed #f9a8d4', marginBottom: '20px' }}></div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.875rem' }}>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Ticket style={{ color: '#ec4899' }} size={20} />
                <div>
                  <p style={{ fontWeight: 700, color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em' }}>EVENT</p>
                  <p style={{ color: '#6b7280', fontWeight: 500 }}>{event.title}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Calendar style={{ color: '#ec4899' }} size={20} />
                <div>
                  <p style={{ fontWeight: 700, color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em' }}>DATE</p>
                  <p style={{ color: '#6b7280', fontWeight: 500 }}>{event.type === 'fixed' ? event.fixed_date : rsvp?.selected_date || 'TBD'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Clock style={{ color: '#ec4899' }} size={20} />
                <div>
                  <p style={{ fontWeight: 700, color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em' }}>TIME</p>
                  <p style={{ color: '#6b7280', fontWeight: 500 }}>{event.type === 'fixed' ? event.fixed_start_time : rsvp?.selected_start_time || 'TBD'}</p>
                </div>
              </div>

              {event.venue && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <MapPin style={{ color: '#ec4899' }} size={20} />
                  <div>
                    <p style={{ fontWeight: 700, color: '#374151', fontSize: '0.75rem', letterSpacing: '0.05em' }}>VENUE</p>
                    <p style={{ color: '#6b7280', fontWeight: 500 }}>{event.venue}</p>
                  </div>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                <QRCodeCanvas
                  value={`https://hangout-invite.vercel.app/invite/${event.id}/pass`}
                  size={90}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: '#ec4899', fontWeight: 700, fontSize: '0.875rem' }}>
                Thank you for saying YES! 💕
              </p>
            </div>

          </div>
        </div>

        <div className="flex gap-4 w-full">
          <Button onClick={downloadImage} disabled={isDownloading} className="flex-1 rounded-full shadow-lg" style={{ backgroundColor: '#f9a8d4', color: '#831843' }}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />} Image
          </Button>
          <Button onClick={downloadPDF} disabled={isDownloading} className="flex-1 rounded-full shadow-lg" style={{ backgroundColor: '#ec4899', color: 'white' }}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} PDF
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
