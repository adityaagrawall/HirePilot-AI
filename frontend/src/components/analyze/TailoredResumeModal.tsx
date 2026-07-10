import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import ModernTemplate, { StructuredResume } from "../resume-templates/ModernTemplate";

interface TailoredResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: StructuredResume | null;
}

export default function TailoredResumeModal({
  isOpen,
  onClose,
  resumeData,
}: TailoredResumeModalProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${resumeData?.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Tailored'}_Resume`,
  });

  if (!isOpen || !resumeData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Your Tailored Resume
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Perfectly formatted for ATS and highly optimized for this specific job.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body: Preview Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-muted/10 flex justify-center custom-scrollbar">
            {/* 
              We wrap the A4 resume in a scaled container for preview purposes.
              The scale makes it fit nicely on desktop screens without zooming.
              During print, react-to-print renders it at full size.
            */}
            <div className="relative shadow-2xl border border-border/50 bg-white origin-top sm:scale-[0.8] md:scale-[0.85] lg:scale-100 transition-transform">
              <ModernTemplate ref={resumeRef} data={resumeData} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/50 bg-card">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handlePrint} variant="gradient" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
