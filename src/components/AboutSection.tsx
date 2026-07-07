import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, ChevronDown, ChevronUp, Users, Award, Clock, Heart, Gamepad2 } from "lucide-react";
import { FAQS } from "../data";
import { TranslationDict } from "../types";

interface AboutSectionProps {
  translations: TranslationDict;
  lang: "TR" | "EN";
  siteName: string;
  bioTR: string;
  bioEN: string;
}

export default function AboutSection({ translations, lang, siteName, bioTR, bioEN }: AboutSectionProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const channelStats = [
    { label: lang === "TR" ? "Takipçiler" : "Followers", value: "12,500+", icon: Heart, color: "text-red-400 bg-red-500/10" },
    { label: lang === "TR" ? "Zirve İzleyici" : "Peak Viewers", value: "2,400+", icon: Users, color: "text-purple-400 bg-purple-500/10" },
    { label: lang === "TR" ? "Yayın Saati" : "Stream Hours", value: "450+ Saat", icon: Clock, color: "text-cyan-400 bg-cyan-500/10" },
    { label: lang === "TR" ? "Turnuva Derecesi" : "Tournament Rank", value: "Faceit Lvl 10", icon: Award, color: "text-yellow-400 bg-yellow-500/10" }
  ];

  const favGames = [
    { name: "Counter-Strike 2", genre: "FPS / Tactical", hours: "12,000 hrs", active: true },
    { name: "Valorant", genre: "FPS / Hero", hours: "1,500 hrs", active: false },
    { name: "Apex Legends", genre: "Battle Royale", hours: "800 hrs", active: false }
  ];

  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full purple-glow pointer-events-none -z-10 opacity-30" />

      {/* Title */}
      <div className="mb-8" id="about-header-container">
        <span className="font-mono text-xs text-purple-400 font-semibold tracking-widest block mb-1">
          // {translations.aboutTitle}
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white uppercase">
          {lang === "TR" ? `${siteName} Kimdir?` : `Who is ${siteName}?`}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="about-layout-wrapper">
        
        {/* BIO & CHANNEL STATS (Left 7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-[#10111a] p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 opacity-10 font-black text-gray-500 select-none text-7xl font-mono pointer-events-none">
              CS2
            </div>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              {lang === "TR" ? bioTR : bioEN}
            </p>

            {/* Favorite Games tags */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider block">
                {translations.aboutFavGames}
              </span>
              <div className="flex flex-wrap gap-3">
                {favGames.map((game) => (
                  <div
                    key={game.name}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 transition ${
                      game.active
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "bg-white/5 text-gray-400 border-white/5"
                    }`}
                  >
                    <Gamepad2 className="h-4 w-4 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">{game.name}</p>
                      <p className="text-[9px] text-gray-500 font-mono font-semibold">{game.genre} • {game.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="stats-dashboard-grid">
            {channelStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/5 bg-[#10111a] p-4 text-center hover:border-purple-500/10 transition duration-200"
                >
                  <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE FAQ ACCORDIONS (Right 5 Columns) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/5 bg-[#10111a] p-6 shadow-xl">
          <div className="flex items-center space-x-2.5 mb-6">
            <User className="h-4.5 w-4.5 text-purple-400" />
            <span className="font-display text-sm font-bold text-white uppercase tracking-wide">
              Sıkça Sorulan Sorular (FAQ)
            </span>
          </div>

          <div className="space-y-3.5" id="faqs-accordion-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              const question = lang === "TR" ? faq.questionTR : faq.questionEN;
              const answer = lang === "TR" ? faq.answerTR : faq.answerEN;
              
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/5 bg-[#141520]/60 overflow-hidden hover:border-purple-500/10 transition duration-200"
                  id={`faq-item-${idx}`}
                >
                  {/* Accordion clickable header button */}
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-white hover:text-purple-300 transition gap-3"
                  >
                    <span>{question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-purple-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
                    )}
                  </button>

                  {/* Expanding answer body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 pt-1 text-xs text-gray-400 font-medium leading-relaxed border-t border-white/5 bg-[#10111a]">
                          {answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
