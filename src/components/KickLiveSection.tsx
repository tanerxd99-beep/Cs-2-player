import React from "react";
import { Tv, Radio, Heart, Volume2 } from "lucide-react";
import { TranslationDict } from "../types";

interface KickLiveSectionProps {
  translations: TranslationDict;
  isStreamLive: boolean;
  setIsStreamLive: (live: boolean) => void;
  siteName: string;
  profilePhoto: string;
  kickUsername: string;
  kickUrl: string;
}

export default function KickLiveSection({
  translations,
  isStreamLive,
  setIsStreamLive,
  siteName,
  profilePhoto,
  kickUsername,
  kickUrl
}: KickLiveSectionProps) {
  return (
    <section id="kick-stream" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full green-glow pointer-events-none -z-10 opacity-30" />

      {/* Title */}
      <div className="mb-8 flex items-center justify-between" id="kick-section-header">
        <div>
          <span className="font-mono text-xs text-[#00e676] font-semibold tracking-widest block mb-1">
            // {translations.kickLiveTitle}
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            {translations.kickLiveSub}
            {isStreamLive && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00e676]"></span>
              </span>
            )}
          </h2>
        </div>

        {/* Demo Switcher */}
        <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-xs text-gray-400">
          <span>Yayın Modu:</span>
          <button
            onClick={() => setIsStreamLive(!isStreamLive)}
            id="kick-toggle-live-btn"
            className={`px-2.5 py-0.5 rounded-full font-bold uppercase transition ${
              isStreamLive ? "bg-[#00e676]/20 text-[#00e676]" : "bg-gray-800 text-gray-500"
            }`}
          >
            {isStreamLive ? translations.kickLive : translations.kickOffline}
          </button>
        </div>
      </div>

      {/* Main Broadcast Module */}
      <div 
        className="w-full"
        id="kick-layout-container"
      >
        
        {/* Stream Video Player Frame (Spans Full Width now) */}
        <div className="w-full flex flex-col justify-between rounded-3xl border border-white/5 bg-[#10111a] overflow-hidden shadow-2xl relative min-h-[450px] lg:min-h-[550px]">
          
          {/* Player Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0e0f17]">
            <div className="flex items-center space-x-2.5">
              <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                isStreamLive ? "bg-[#00e676]/20 text-[#00e676]" : "bg-gray-800 text-gray-400"
              }`}>
                {isStreamLive ? translations.kickLive : translations.kickOffline}
              </span>
              <span className="font-mono text-xs text-gray-400 font-semibold uppercase">
                {isStreamLive ? `${siteName} is playing Counter-Strike 2` : `${siteName} is offline`}
              </span>
            </div>
            {isStreamLive && (
              <div className="flex items-center text-red-500 text-xs font-semibold gap-1">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                <span>1.4K İzleyici</span>
              </div>
            )}
          </div>

          {/* Core Player Space */}
          <div className="relative flex-1 flex items-center justify-center bg-black/40 overflow-hidden group">
            
            {/* OFFLINE VIEW */}
            {!isStreamLive ? (
              <div className="text-center p-8 z-10 flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-gray-800/40 border border-white/5 flex items-center justify-center text-gray-500 mb-4 shadow-lg">
                  <Tv className="h-10 w-10" />
                </div>
                <div className="bg-[#12131d] border border-white/5 rounded-2xl px-8 py-5 max-w-sm shadow-2xl">
                  <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider mb-1">OFFLINE</span>
                  <p className="text-white font-display text-lg font-bold mb-1 uppercase">{siteName} is offline</p>
                  <p className="text-xs text-gray-400">Yayın programı için duyuruları takip edin.</p>
                </div>
              </div>
            ) : (
              /* LIVE SIMULATION VIEW */
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80" />
                
                {/* Live overlay markers */}
                <div className="z-10 flex justify-between w-full">
                  <div className="bg-[#00e676] text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-black animate-ping" />
                    LIVE
                  </div>
                  <div className="bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded border border-white/10 flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>60 FPS</span>
                  </div>
                </div>

                {/* Central Play Indicator */}
                <div className="z-10 self-center flex flex-col items-center gap-2">
                  <div className="h-16 w-16 rounded-full bg-[#00e676]/10 backdrop-blur-sm border border-[#00e676]/30 flex items-center justify-center text-[#00e676] group-hover:scale-110 transition cursor-pointer shadow-2xl">
                    <Radio className="h-8 w-8 animate-pulse" />
                  </div>
                  <span className="text-xs font-semibold text-white/90 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm">Sesi Aç & Canlı Yayını İzle</span>
                </div>

                {/* Stream stats overlay */}
                <div className="z-10 flex justify-between items-center w-full bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={profilePhoto} 
                      alt="Avatar" 
                      className="h-10 w-10 rounded-full border border-purple-500/30 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{siteName}</p>
                      <p className="text-[10px] text-gray-300">Rekabetçi Maçlar & Topluluk Yayını</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <Heart className="h-4 w-4 hover:text-pink-500 cursor-pointer transition" />
                    <span className="text-[10px] font-bold">12.5K Takipçi</span>
                  </div>
                </div>
              </div>
            )}

            {/* Aesthetic watermark logo */}
            <div className="absolute right-5 bottom-5 opacity-10 text-white font-mono text-3xl font-black pointer-events-none z-0">
              KICK
            </div>
          </div>

          {/* Player Footer Action Button */}
          <a
            href={kickUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="kick-external-stream-link"
            className="w-full bg-[#181926] border-t border-white/5 text-center py-4 font-display text-sm font-bold tracking-widest text-purple-300 hover:text-white hover:bg-purple-600 transition duration-300 flex items-center justify-center gap-2"
          >
            <Tv className="h-4.5 w-4.5" />
            {translations.kickGoToStream}
          </a>
        </div>
      </div>
    </section>
  );
}
