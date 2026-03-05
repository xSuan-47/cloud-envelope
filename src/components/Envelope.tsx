import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, Trash2, Clock } from 'lucide-react';

interface EnvelopeProps {
  isOpen: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  label?: string;
  isBreathing?: boolean;
}

export const Envelope: React.FC<EnvelopeProps> = ({ 
  isOpen, 
  onClick, 
  children, 
  label,
  isBreathing = false
}) => {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={onClick}
        className="relative cursor-pointer group"
        style={{ perspective: "1000px" }}
      >
        {/* Envelope Body */}
        <div className="relative w-64 h-40 bg-[#f3ece4] rounded-sm shadow-lg overflow-hidden border border-[#e8dfd5]">
          {/* Breathing Light Effect */}
          {isBreathing && (
            <motion.div
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white blur-xl pointer-events-none"
            />
          )}

          {/* Envelope Flap (Top) */}
          <motion.div
            initial={false}
            animate={{ 
              rotateX: isOpen ? -180 : 0,
              zIndex: isOpen ? 0 : 20
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#e8dfd5] border-b border-[#dcd1c4] z-20"
          />

          {/* Envelope Content Area */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Mail className="w-8 h-8 text-[#b8a99a] opacity-40" />
          </div>

          {/* Envelope Front (Bottom/Sides) */}
          <div className="absolute bottom-0 left-0 w-full h-full z-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-full border-t-[80px] border-t-transparent border-l-[128px] border-l-[#f3ece4] border-r-[128px] border-r-[#f3ece4] border-b-[80px] border-b-[#e8dfd5]" />
          </div>
        </div>

        {/* Label */}
        {label && (
          <div className="mt-4 text-sm text-[#8a7e72] font-medium tracking-widest uppercase">
            {label}
          </div>
        )}
      </motion.div>

      {/* Letter Content (Appears when open) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: -100, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute z-30 w-72"
          >
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/50 min-h-[200px]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
