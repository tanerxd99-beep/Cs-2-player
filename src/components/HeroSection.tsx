import React from "react";
import { motion } from "motion/react";
import { Sparkles, Gamepad2 } from "lucide-react";
import { TranslationDict } from "../types";

interface HeroSectionProps {
  translations: TranslationDict;
  siteName: string;
  profilePhoto: string;
  isStreamLive?: boolean;
}

export default function HeroSection({ translations, siteName, profilePhoto, isStreamLive = false }: HeroSectionProps) {
  return (
    <section 
      id="home" 
      className="relative flex flex-col items-center justify-center pt-12 pb-12 overflow-hidden"
    >
      {/* Background glow layers */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full purple-glow pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full cyan-glow pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none -z-10" />

      {/* Pulsing Liveness Indicator Badge */}
      {isStreamLive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(0,230,118,0.25)] animate-pulse"
          id="hero-live-badge"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e676]"></span>
          </span>
          <span>{translations.kickLive || "Şu an Yayında"}</span>
        </motion.div>
      )}

      {/* Avatar with Orbital Ring */}
      <div className="relative flex items-center justify-center mb-6" id="hero-avatar-orbit-wrapper">
        
        {/* Animated outer ring */}
        <div className="absolute w-[180px] h-[180px] rounded-full border border-purple-500/20 animate-slow-spin">
          {/* Glowing orbital dot */}
          <div className="absolute top-2 left-6 h-3.5 w-3.5 rounded-full bg-purple-400 shadow-[0_0_12px_#a855f7] border-2 border-[#0a0b0f]" />
        </div>
        
        {/* Glow halo */}
        <div className="absolute w-[160px] h-[160px] rounded-full border border-pink-500/30 animate-pulse blur-[1px]" />
        
        {/* Main avatar wrapper */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative h-[140px] w-[140px] rounded-full border-4 border-[#121420] overflow-hidden bg-[#161925] p-1.5 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          id="hero-avatar-inner"
        >
          <img 
            src={profilePhoto} 
            alt={`${siteName} Profile`} 
            className="h-full w-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
        id="hero-title-container"
      >
        <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-purple-400 filter drop-shadow-[0_2px_10px_rgba(168,85,247,0.2)] mb-3 uppercase">
          {siteName}
        </h1>
        
        {/* Streamer details */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs md:text-sm font-semibold tracking-wider text-gray-400 uppercase">
          <span className="flex items-center text-purple-400 gap-1 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/15">
            <Gamepad2 className="h-3.5 w-3.5" />
            CS2 PLAYER
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center text-pink-400 gap-1 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/15">
            <Sparkles className="h-3.5 w-3.5" />
            CONTENT CREATOR
          </span>
        </div>
      </motion.div>
    </section>
  );
}
