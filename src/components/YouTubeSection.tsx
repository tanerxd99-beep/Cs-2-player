import React from "react";
import { motion } from "motion/react";
import { Youtube, ExternalLink } from "lucide-react";
import { TranslationDict, PlaylistItem } from "../types";

interface YouTubeSectionProps {
  translations: TranslationDict;
  playlists: PlaylistItem[];
}

export default function YouTubeSection({ translations, playlists }: YouTubeSectionProps) {
  return (
    <section id="youtube-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-10 left-10 w-[250px] h-[250px] rounded-full cyan-glow pointer-events-none -z-10 opacity-30" />

      {/* ==================== YOUTUBE PLAYLISTS SECTION ==================== */}
      <div>
        <div className="mb-8" id="playlists-header-container">
          <span className="font-mono text-xs text-red-500 font-semibold tracking-widest block mb-1">
            // {translations.playlistsTitle}
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">
            {translations.playlistsSub}
          </h2>
        </div>

        {/* Playlists cards grid layout */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          id="playlists-grid"
        >
          {playlists.map((playlist, idx) => (
            <motion.a
              key={playlist.title}
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-[#11121b]/80 hover:border-purple-500/30 transition-all duration-300 shadow-xl"
              id={`playlist-card-${idx}`}
            >
              {/* Cover Thumbnail Image */}
              <div className="relative aspect-video overflow-hidden bg-black/40">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                
                {/* Visual shadow block */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f17] via-transparent to-transparent" />

                {/* Overlaid count badge from screenshots */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs text-white">
                  <Youtube className="h-3.5 w-3.5 text-red-500" />
                  <span className="font-mono font-bold">{playlist.videoCount} video</span>
                </div>
              </div>

              {/* Text metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-purple-300 transition duration-200 line-clamp-1 mb-1">
                    {playlist.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {translations.playlistsButton}
                  </p>
                </div>

                <div className="mt-4 flex items-center text-xs text-purple-400 font-bold group-hover:text-white transition duration-200 gap-1.5">
                  <span>Listeye Git</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
