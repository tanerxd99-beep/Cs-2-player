import React from "react";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { SocialItem, TranslationDict } from "../types";

interface SocialGridProps {
  translations: TranslationDict;
  socialItems: SocialItem[];
}

export default function SocialGrid({ translations, socialItems }: SocialGridProps) {
  
  // Helper to dynamically resolve Lucide icon components by name
  const getIcon = (name: string) => {
    // Falls back to standard Lucide icons
    const IconComponent = (Icons as any)[name] || Icons.Share2;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <section id="social" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-0 right-10 w-[300px] h-[300px] rounded-full purple-glow pointer-events-none -z-10 opacity-40" />

      {/* Retro Title Section */}
      <div className="mb-8" id="social-header-container">
        <span className="font-mono text-xs text-purple-400 font-semibold tracking-widest block mb-1">
          // {translations.socialMediaTitle}
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">
          {translations.socialMediaSub}
        </h2>
      </div>

      {/* Grid container */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        id="social-cards-grid"
      >
        {socialItems.map((item, idx) => (
          <motion.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border bg-[#11121b]/80 backdrop-blur-sm transition-all duration-300 group ${item.themeColor} ${item.hoverColor}`}
            id={`social-card-${item.id}`}
          >
            {/* Animated Icon Ring */}
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10">
              {getIcon(item.iconName)}
            </div>

            {/* Platform Name */}
            <span className="font-display text-lg font-bold text-white mb-1">
              {item.name}
            </span>

            {/* Username/Handle */}
            <span className="font-mono text-xs text-gray-400">
              {item.username}
            </span>

            {/* Micro button */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
              {translations.socialMediaFollow}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
