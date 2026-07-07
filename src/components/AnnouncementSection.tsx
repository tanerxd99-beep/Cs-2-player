import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Megaphone, Calendar, Sparkles, AlertCircle, Pin, ChevronRight, Bell } from "lucide-react";
import { Announcement, TranslationDict } from "../types";

interface AnnouncementSectionProps {
  translations: TranslationDict;
  announcements: Announcement[];
  lang: "TR" | "EN";
}

export default function AnnouncementSection({ translations, announcements, lang }: AnnouncementSectionProps) {
  const activeAnnouncements = announcements.filter((a) => a.active);
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);

  if (activeAnnouncements.length === 0) return null;

  const getImportanceStyles = (importance?: "high" | "medium" | "low") => {
    switch (importance) {
      case "high":
        return {
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.35)] border-red-500/30",
          dot: "bg-red-500 animate-ping",
          badgeBg: "bg-red-500/10 text-red-400 border-red-500/20"
        };
      case "medium":
        return {
          glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)] border-purple-500/30",
          dot: "bg-purple-500",
          badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20"
        };
      default:
        return {
          glow: "shadow-[0_0_10px_rgba(59,130,246,0.2)] border-blue-500/20",
          dot: "bg-blue-500",
          badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/10"
        };
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" id="announcements-section">
      <div className="absolute top-1/2 left-10 w-[250px] h-[250px] rounded-full purple-glow pointer-events-none -z-10 opacity-20" />
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6" id="announcements-header-wrapper">
        <div>
          <span className="font-mono text-xs text-purple-400 font-semibold tracking-widest block mb-1 uppercase">
            // {lang === "TR" ? "YAYINCI DUYURULARI" : "STREAMER ANNOUNCEMENTS"}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-purple-400 animate-bounce" style={{ animationDuration: "3s" }} />
            {lang === "TR" ? "Duyurular & Güncellemeler" : "Announcements & Updates"}
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-500 hidden sm:inline-block">
          {activeAnnouncements.length} {lang === "TR" ? "aktif kayıt" : "active logs"}
        </span>
      </div>

      {/* Grid or List of Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="announcements-grid">
        {activeAnnouncements.map((ann, idx) => {
          const styles = getImportanceStyles(ann.importance);
          const title = lang === "TR" ? ann.titleTR : ann.titleEN;
          const content = lang === "TR" ? ann.contentTR : ann.contentEN;
          const badge = lang === "TR" ? ann.badgeTR : ann.badgeEN;

          return (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`relative overflow-hidden rounded-2xl border bg-[#10111a]/95 p-5 transition duration-300 hover:bg-[#131521] hover:scale-[1.01] flex flex-col justify-between ${styles.glow}`}
              id={`announcement-card-${ann.id}`}
            >
              {/* Importance Indicator Dot & Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    {ann.importance === "high" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`}></span>
                  </span>
                  
                  {badge && (
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border ${styles.badgeBg}`}>
                      {badge}
                    </span>
                  )}
                  
                  {ann.importance === "high" && (
                    <span className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                      <Pin className="h-3 w-3 fill-red-400/20" /> {lang === "TR" ? "Önemli" : "Important"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>{ann.date}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 mb-4">
                <h3 className="font-display text-base font-bold text-white mb-2 leading-snug group-hover:text-purple-300">
                  {title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {content}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setSelectedAnn(ann)}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  {lang === "TR" ? "Detayları Oku" : "Read Details"}
                  <ChevronRight className="h-3 w-3" />
                </button>
                <Bell className="h-3.5 w-3.5 text-gray-600" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal for Full Announcement Detail */}
      <AnimatePresence>
        {selectedAnn && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAnn(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0c0d16] p-6 shadow-2xl z-10"
              id="announcement-detail-modal"
            >
              {/* Highlight ribbon */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  selectedAnn.importance === "high" ? "bg-red-500" :
                  selectedAnn.importance === "medium" ? "bg-purple-500" :
                  "bg-blue-500"
                }`} 
              />

              <div className="flex items-center justify-between gap-4 mb-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    selectedAnn.importance === "high" ? "bg-red-500" :
                    selectedAnn.importance === "medium" ? "bg-purple-500" :
                    "bg-blue-500"
                  }`} />
                  
                  {selectedAnn.badgeTR && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {lang === "TR" ? selectedAnn.badgeTR : selectedAnn.badgeEN}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-gray-500">{selectedAnn.date}</span>
              </div>

              <h3 className="font-display text-xl font-bold text-white mb-3">
                {lang === "TR" ? selectedAnn.titleTR : selectedAnn.titleEN}
              </h3>

              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mb-6 font-medium">
                {lang === "TR" ? selectedAnn.contentTR : selectedAnn.contentEN}
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedAnn(null)}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2 text-xs font-bold text-white transition duration-200 cursor-pointer"
                >
                  {lang === "TR" ? "Kapat" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
