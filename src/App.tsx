import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Trash2, Clock, Sparkles } from 'lucide-react';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Envelope } from './components/Envelope';
import { TypewriterText } from './components/TypewriterText';

interface Letter {
  id: string;
  content: string;
  timestamp: string;
  passcode: string;
}

export default function App() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [content, setContent] = useState("");
  const [passcode, setPasscode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [receivedLetters, setReceivedLetters] = useState<Letter[]>([]);
  const [unlockedLetter, setUnlockedLetter] = useState<Letter | null>(null);
  const [isFlying, setIsFlying] = useState(false);
  const [unlockError, setUnlockError] = useState(false);

  const handleSend = useCallback(() => {
    if (!content.trim() || !passcode.trim()) return;

    setIsFlying(true);
    setLeftOpen(false);
    
    setTimeout(() => {
      const newLetter: Letter = {
        id: Date.now().toString(),
        content: content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        passcode: passcode.trim().toLowerCase(),
      };
      setReceivedLetters(prev => [newLetter, ...prev]);
      setIsFlying(false);
      setContent("");
      setPasscode("");
    }, 1000);
  }, [content, passcode]);

  const handleUnlock = () => {
    const found = receivedLetters.find(l => l.passcode === searchCode.trim().toLowerCase());
    if (found) {
      setUnlockedLetter(found);
      setRightOpen(true);
      setUnlockError(false);
      setSearchCode("");
    } else {
      setUnlockError(true);
      setTimeout(() => setUnlockError(false), 2000);
    }
  };

  const clearLetters = () => {
    setReceivedLetters([]);
    setUnlockedLetter(null);
    setRightOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-white">
      {/* BackgroundParticles removed for pure white look */}

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 text-center z-10"
      >
        <h1 className="text-3xl font-light tracking-[0.3em] text-[#8a7e72] mb-2 font-serif">云端信笺</h1>
      </motion.header>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center justify-center z-10">
        
        {/* Left: Writing Side */}
        <div className="flex flex-col items-center">
          <Envelope 
            isOpen={leftOpen} 
            onClick={() => setLeftOpen(!leftOpen)}
            label="寄出思念"
          >
            <div className="flex flex-col h-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此写下你的心语..."
                className="w-full h-24 bg-transparent border-none focus:ring-0 text-[#5a524a] font-handwriting text-xl resize-none placeholder:text-[#b8a99a]/50"
              />
              <div className="mt-2 pt-2 border-t border-[#f0e8e0]">
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="设置开启暗语..."
                  className="w-full bg-transparent border-none focus:ring-0 text-[#8a7e72] text-xs tracking-widest placeholder:text-[#b8a99a]/40"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSend();
                  }}
                  disabled={!content.trim() || !passcode.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#d4c5b9] text-white rounded-full text-xs font-light tracking-widest hover:bg-[#c4b5a9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" />
                  寄出
                </motion.button>
              </div>
            </div>
          </Envelope>
        </div>

        {/* Right: Receiving Side */}
        <div className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-[240px]">
            <div className="relative">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="输入暗语开启信笺..."
                className={`w-full px-4 py-2 bg-white/50 backdrop-blur-sm border ${unlockError ? 'border-red-200' : 'border-[#e8dfd5]'} rounded-full text-xs tracking-widest text-[#8a7e72] focus:outline-none focus:border-[#d4c5b9] transition-all placeholder:text-[#b8a99a]/50`}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleUnlock}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#d4c5b9] hover:text-[#c4b5a9]"
              >
                <Sparkles className="w-4 h-4" />
              </motion.button>
            </div>
            <AnimatePresence>
              {unlockError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-red-400 mt-2 text-center tracking-widest"
                >
                  暗语不正确，请重试
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <Envelope 
            isOpen={rightOpen} 
            onClick={() => {
              if (unlockedLetter) setRightOpen(!rightOpen);
            }}
            label="收悉回响"
            isBreathing={receivedLetters.length > 0}
          >
            <div className="flex flex-col h-full">
              {unlockedLetter ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] text-[#b8a99a] tracking-widest uppercase">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {unlockedLetter.timestamp}
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 opacity-50" />
                      暗语: {unlockedLetter.passcode}
                    </div>
                  </div>
                  <TypewriterText 
                    text={unlockedLetter.content} 
                    className="text-[#5a524a] font-handwriting text-xl"
                  />
                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUnlockedLetter(null);
                        setRightOpen(false);
                      }}
                      className="text-[10px] text-[#b8a99a] hover:text-[#8a7e72] flex items-center gap-1 uppercase tracking-widest transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      关闭此信
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-[#b8a99a]">
                  <p className="text-sm font-light tracking-widest italic text-center">
                    输入正确暗语<br/>开启尘封的思念
                  </p>
                </div>
              )}
            </div>
          </Envelope>
          
          {receivedLetters.length > 0 && (
            <button
              onClick={clearLetters}
              className="mt-8 text-[9px] text-[#b8a99a] hover:text-[#8a7e72] uppercase tracking-[0.3em] transition-colors"
            >
              清空所有信件 ({receivedLetters.length})
            </button>
          )}
        </div>
      </div>

      {/* Flying Letter Animation */}
      <AnimatePresence>
        {isFlying && (
          <motion.div
            initial={{ 
              x: "-15vw", 
              y: 0, 
              scale: 0.5, 
              opacity: 0,
              rotate: -15
            }}
            animate={{ 
              x: "15vw", 
              y: [0, -150, 0], 
              scale: [0.5, 1, 0.5], 
              opacity: [0, 1, 1, 0],
              rotate: 15
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeInOut",
              times: [0, 0.5, 0.8, 1]
            }}
            className="fixed z-50 pointer-events-none"
          >
            <div className="bg-white p-4 w-40 h-28 shadow-2xl rounded-sm border border-[#e8dfd5] flex items-center justify-center">
              <div className="w-full h-full border border-[#f0e8e0] border-dashed rounded-sm flex items-center justify-center">
                 <Send className="w-6 h-6 text-[#d4c5b9] opacity-50" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer removed */}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e8dfd5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4c5b9;
        }
      `}} />
    </div>
  );
}
