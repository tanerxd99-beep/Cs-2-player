import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MousePointer, Sliders, Eye, Tv, Copy, Check, ChevronDown, Play, Youtube, Info, Gamepad2, Sparkles, SlidersHorizontal, Search
} from "lucide-react";
import { TranslationDict } from "../types";

export interface CS2SettingsData {
  mouseDpi: string;
  mouseSens: string;
  mousePolling: string;

  viewmodelFov: string;
  viewmodelOffsetX: string;
  viewmodelOffsetY: string;
  viewmodelOffsetZ: string;
  viewmodelPresetpos: string;
  viewmodelConsoleCode: string;

  hudColor: string;
  hudComment: string;

  videoMode: string;
  videoAspect: string;
  videoResolution: string;
  videoRefresh: string;
  videoBrightness: string;
  videoComment: string;

  crosshairName: string;
  crosshairCode: string;
  crosshairComment: string;
  crosshairType?: string;
  crosshairColor?: string;
  crosshairSize?: string;
  crosshairThickness?: string;
  crosshairGap?: string;
  crosshairOutline?: boolean;
  crosshairDot?: boolean;

  radarHudScale: string;
  radarScale: string;
  radarRotate: string;
  radarIconScaleMin: string;
  radarConsoleCode: string;

  youtubeVideoUrl: string;
}

interface CrosshairIconProps {
  type: "small" | "regular" | "large" | "thick" | "dot" | "plus" | "dot-cross";
  color: string;
}

export function CrosshairIcon({ type, color }: CrosshairIconProps) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {type === "dot" && (
        <circle cx="12" cy="12" r="2.5" fill={color} />
      )}
      {type === "small" && (
        <>
          <line x1="12" y1="9" x2="12" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="13" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="12" x2="11" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="13" y1="12" x2="15" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "regular" && (
        <>
          <line x1="12" y1="7" x2="12" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="14" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="7" y1="12" x2="10" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="12" x2="17" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "large" && (
        <>
          <line x1="12" y1="5" x2="12" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="15" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "thick" && (
        <>
          <line x1="12" y1="6" x2="12" y2="9" stroke={color} strokeWidth="3.5" strokeLinecap="square" />
          <line x1="12" y1="15" x2="12" y2="18" stroke={color} strokeWidth="3.5" strokeLinecap="square" />
          <line x1="6" y1="12" x2="9" y2="12" stroke={color} strokeWidth="3.5" strokeLinecap="square" />
          <line x1="15" y1="12" x2="18" y2="12" stroke={color} strokeWidth="3.5" strokeLinecap="square" />
        </>
      )}
      {type === "plus" && (
        <>
          <line x1="12" y1="6" x2="12" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="12" x2="18" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "dot-cross" && (
        <>
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <line x1="12" y1="8" x2="12" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="14" x2="12" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="12" x2="10" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="14" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const CROSSHAIR_GALLERY = [
  {
    id: "beyaz-kucuk",
    name: "Beyaz Küçük Cross",
    code: "CSGO-KmQzd-hmeUU-eOR6w-FN4yd-YCdRF",
    type: "small" as const,
    color: "#ffffff"
  },
  {
    id: "beyaz",
    name: "Beyaz Cross",
    code: "CSGO-vytxc-tjaP4-EEDhQ-riKa6-MqNkO",
    type: "regular" as const,
    color: "#ffffff"
  },
  {
    id: "mavi",
    name: "Mavi Cross",
    code: "CSGO-3zBNN-Noo3x-7nH7e-Y9wqx-aQSFE",
    type: "regular" as const,
    color: "#0066ff"
  },
  {
    id: "wicadia",
    name: "Wicadia Cross",
    code: "CSGO-WQhyz-JcvVK-Y9ptw-H56mk-37QmH",
    type: "regular" as const,
    color: "#00ff33"
  },
  {
    id: "mavi-nokta",
    name: "Mavi Nokta Cross",
    code: "CSGO-GaNEQ-dQ2YA-QOtr4-a2tAj-mMN2G",
    type: "dot-cross" as const,
    color: "#00d2ff"
  },
  {
    id: "beyaz-kalin",
    name: "Beyaz Kalın Cross",
    code: "CSGO-Y2uUb-2BSRW-mLYxZ-5YGop-BhiaB",
    type: "thick" as const,
    color: "#ffffff"
  },
  {
    id: "mavi-alt",
    name: "Mavi Cross (Alternatif)",
    code: "CSGO-FAFJV-EHLQr-QoiRh-yTzNV-xbM2G",
    type: "regular" as const,
    color: "#00e5ff"
  },
  {
    id: "nokta",
    name: "Nokta Cross",
    code: "CSGO-ZpJTc-uyByC-sWfyB-9MOUG-4J3ED",
    type: "dot" as const,
    color: "#0088ff"
  },
  {
    id: "kirmizi",
    name: "Kırmızı Cross",
    code: "CSGO-vs5hj-dFmQd-Pa9Xn-sATFA-2ECtG",
    type: "regular" as const,
    color: "#ff3b30"
  },
  {
    id: "acik-mavi",
    name: "Açık Mavi Cross",
    code: "CSGO-S3crj-Lsv8x-dPyNt-fo6zW-fcEBM",
    type: "regular" as const,
    color: "#00e5ff"
  },
  {
    id: "acik-mavi-kucuk",
    name: "Açık Mavi Küçük Cross",
    code: "CSGO-HSdRz-mashF-aA55z-iKZud-pzJzN",
    type: "small" as const,
    color: "#00e5ff"
  },
  {
    id: "sari-kucuk",
    name: "Sarı Küçük Cross",
    code: "CSGO-zC97q-EPnMN-nwc2y-N9ta9-WsdqA",
    type: "small" as const,
    color: "#ffcc00"
  },
  {
    id: "yesil-kucuk",
    name: "Yeşil Küçük Cross",
    code: "CSGO-kfi33-uWfoP-GJCiN-3sNCx-zwsyM",
    type: "small" as const,
    color: "#00e676"
  },
  {
    id: "duz-beyaz-arti",
    name: "Düz Beyaz Artı Cross",
    code: "CSGO-hCN5b-jZ4xb-GQwVH-zxUsN-nvHCF",
    type: "plus" as const,
    color: "#ffffff"
  }
];

interface CS2SettingsSectionProps {
  translations: TranslationDict;
  settings: CS2SettingsData;
  siteName: string;
  onNavigateToSection?: (sec: string) => void;
}

export default function CS2SettingsSection({ translations, settings, siteName, onNavigateToSection }: CS2SettingsSectionProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>("mouse");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedGalleryItem, setExpandedGalleryItem] = useState<string | null>(null);
  const [crosshairSearch, setCrosshairSearch] = useState("");
  const [crosshairFilter, setCrosshairFilter] = useState("all");

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Extract YouTube video ID if URL is provided
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      // Try finding ID from shorts or direct
      if (url.includes("shorts/")) {
        const parts = url.split("shorts/");
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else {
        videoId = url; // assume direct ID was input
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(settings.youtubeVideoUrl);

  const matchedPreset = CROSSHAIR_GALLERY.find(g => g.code === settings.crosshairCode) || {
    type: (settings.crosshairType as any) || "small",
    color: settings.crosshairColor || "#ffffff",
    size: settings.crosshairSize !== undefined ? Number(settings.crosshairSize) : 3,
    thickness: settings.crosshairThickness !== undefined ? Number(settings.crosshairThickness) : 1.5,
    gap: settings.crosshairGap !== undefined ? Number(settings.crosshairGap) : -2,
    outline: settings.crosshairOutline !== undefined ? settings.crosshairOutline : true,
  };

  const accordions = [
    {
      id: "mouse",
      title: "Mouse Ayarları",
      icon: <MousePointer className="h-4 w-4 text-purple-400" />,
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">DPI</span>
            <span className="text-sm font-bold font-mono text-purple-400">{settings.mouseDpi}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">SENS</span>
            <span className="text-sm font-bold font-mono text-purple-400">{settings.mouseSens}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">POLLING RATE</span>
            <span className="text-sm font-bold font-mono text-purple-400">{settings.mousePolling}</span>
          </div>
        </div>
      )
    },
    {
      id: "viewmodel",
      title: "Viewmodel Ayarları",
      icon: <Sliders className="h-4 w-4 text-pink-400" />,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">VIEWMODEL_FOV</span>
              <span className="text-xs font-bold font-mono text-pink-400">{settings.viewmodelFov}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">VIEWMODEL_OFFSET_X</span>
              <span className="text-xs font-bold font-mono text-pink-400">{settings.viewmodelOffsetX}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">VIEWMODEL_OFFSET_Y</span>
              <span className="text-xs font-bold font-mono text-pink-400">{settings.viewmodelOffsetY}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">VIEWMODEL_OFFSET_Z</span>
              <span className="text-xs font-bold font-mono text-pink-400">{settings.viewmodelOffsetZ}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5 sm:col-span-2">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">VIEWMODEL_PRESETPOS</span>
              <span className="text-xs font-bold font-mono text-pink-400">{settings.viewmodelPresetpos}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-[10px] font-mono text-gray-500 font-bold mb-2 uppercase tracking-wide">
              // Konsola yapıştır – ayarları direkt uygula!
            </p>
            <button
              onClick={() => handleCopy(settings.viewmodelConsoleCode, "viewmodel")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider hover:bg-pink-500 hover:text-white transition-all duration-200"
            >
              {copiedKey === "viewmodel" ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>KOD KOPYALANDI!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>VIEWMODEL KODLARINI KOPYALA</span>
                </>
              )}
            </button>
          </div>
        </div>
      )
    },
    {
      id: "hud",
      title: "HUD Ayarları",
      icon: <Info className="h-4 w-4 text-yellow-400" />,
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">CL_HUD_COLOR</span>
            <span className="text-sm font-bold font-mono text-yellow-400">{settings.hudColor}</span>
          </div>
          <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wide">
            {settings.hudComment || `// HUD rengi 11 = ${siteName} bişeyleri mi seviyor ki?`}
          </p>
        </div>
      )
    },
    {
      id: "video",
      title: "Görüntü Ayarları",
      icon: <Tv className="h-4 w-4 text-cyan-400" />,
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">GÖRÜNTÜ MODU</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{settings.videoMode}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">GÖRÜNTÜ ORANI</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{settings.videoAspect}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">ÇÖZÜNÜRLÜK</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{settings.videoResolution}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">YENİLEME HIZI</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{settings.videoRefresh}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[#0e0f17] border border-white/5">
            <span className="text-xs font-bold font-mono text-gray-500 uppercase">PARLAKLIK</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{settings.videoBrightness}</span>
          </div>
          <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wide">
            {settings.videoComment || `// Gelişmiş görüntü ayarları için yukarıdaki videoyu izle`}
          </p>
        </div>
      )
    },
    {
      id: "crosshair",
      title: "Nişangah (Crosshair)",
      icon: <Gamepad2 className="h-4 w-4 text-emerald-400" />,
      content: (
        <div className="space-y-4 pt-2">
          {/* Active Featured Crosshair */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-3">
            <span className="text-[10px] font-mono text-emerald-400 font-black tracking-widest block uppercase">
              // ŞU ANKİ AKTİF NİŞANGAHIM
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden relative">
                  {/* Dynamic Custom Crosshair Preview */}
                  <div className="relative scale-[0.35] pointer-events-none flex items-center justify-center">
                    {(() => {
                      const itemColor = settings.crosshairColor || matchedPreset.color;
                      const itemType = settings.crosshairType || matchedPreset.type;
                      const itemSize = settings.crosshairSize !== undefined ? Number(settings.crosshairSize) : 3;
                      const itemThickness = settings.crosshairThickness !== undefined ? Number(settings.crosshairThickness) : 1.5;
                      const itemGap = settings.crosshairGap !== undefined ? Number(settings.crosshairGap) : -2;
                      const itemOutline = settings.crosshairOutline !== undefined ? settings.crosshairOutline : true;
                      const hasDot = itemType === "dot" || itemType === "dot-cross" || settings.crosshairDot === true;
                      const hasLines = itemType !== "dot";

                      return (
                        <>
                          {/* Outline stroke (underneath) */}
                          {itemOutline && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              {hasDot && (
                                <div 
                                  className="rounded-full bg-black" 
                                  style={{ 
                                    width: `${itemSize * 2.2 + 2}px`, 
                                    height: `${itemSize * 2.2 + 2}px`,
                                  }} 
                                />
                              )}
                              {hasLines && (
                                <>
                                  {/* Vertical Lines */}
                                  <div 
                                    className="absolute bg-black"
                                    style={{
                                      width: `${itemThickness + 2}px`,
                                      height: `${itemSize * 5 + 2}px`,
                                      transform: `translateY(${-itemGap - itemSize * 2.5}px)`
                                    }}
                                  />
                                  <div 
                                    className="absolute bg-black"
                                    style={{
                                      width: `${itemThickness + 2}px`,
                                      height: `${itemSize * 5 + 2}px`,
                                      transform: `translateY(${itemGap + itemSize * 2.5}px)`
                                    }}
                                  />
                                  {/* Horizontal Lines */}
                                  <div 
                                    className="absolute bg-black"
                                    style={{
                                      width: `${itemSize * 5 + 2}px`,
                                      height: `${itemThickness + 2}px`,
                                      transform: `translateX(${-itemGap - itemSize * 2.5}px)`
                                    }}
                                  />
                                  <div 
                                    className="absolute bg-black"
                                    style={{
                                      width: `${itemSize * 5 + 2}px`,
                                      height: `${itemThickness + 2}px`,
                                      transform: `translateX(${itemGap + itemSize * 2.5}px)`
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          )}

                          {/* Main Crosshair Lines */}
                          <div className="relative flex items-center justify-center">
                            {hasDot && (
                              <div 
                                className="rounded-full shadow-md z-10" 
                                style={{ 
                                  backgroundColor: itemColor,
                                  width: `${itemSize * 2.2}px`, 
                                  height: `${itemSize * 2.2}px`,
                                }} 
                              />
                            )}
                            {hasLines && (
                              <>
                                {/* Top Line */}
                                <div 
                                  className="absolute shadow-sm"
                                  style={{
                                    backgroundColor: itemColor,
                                    width: `${itemThickness}px`,
                                    height: `${itemSize * 5}px`,
                                    transform: `translateY(${-itemGap - itemSize * 2.5}px)`
                                  }}
                                />
                                {/* Bottom Line */}
                                <div 
                                  className="absolute shadow-sm"
                                  style={{
                                    backgroundColor: itemColor,
                                    width: `${itemThickness}px`,
                                    height: `${itemSize * 5}px`,
                                    transform: `translateY(${itemGap + itemSize * 2.5}px)`
                                  }}
                                />
                                {/* Left Line */}
                                <div 
                                  className="absolute shadow-sm"
                                  style={{
                                    backgroundColor: itemColor,
                                    width: `${itemSize * 5}px`,
                                    height: `${itemThickness}px`,
                                    transform: `translateX(${-itemGap - itemSize * 2.5}px)`
                                  }}
                                />
                                {/* Right Line */}
                                <div 
                                  className="absolute shadow-sm"
                                  style={{
                                    backgroundColor: itemColor,
                                    width: `${itemSize * 5}px`,
                                    height: `${itemThickness}px`,
                                    transform: `translateX(${itemGap + itemSize * 2.5}px)`
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{settings.crosshairName}</h4>
                  <p className="text-[10px] font-mono text-gray-400">{settings.crosshairComment || "İnan Güncel CS2 Crosshair Kodu"}</p>
                </div>
              </div>
            </div>
            
            <div className="py-2.5 px-3 rounded-lg bg-[#07080d] border border-white/5">
              <p className="text-xs font-mono text-emerald-400 break-all select-all font-bold">
                {settings.crosshairCode}
              </p>
            </div>

            <button
              onClick={() => handleCopy(settings.crosshairCode, "crosshair-main")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all duration-200"
            >
              {copiedKey === "crosshair-main" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>KOD KOPYALANDI!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>KODU KOPYALA</span>
                </>
              )}
            </button>
          </div>

          {/* Call to action to dedicated panel */}
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 space-y-3 text-center">
            <span className="text-[10px] font-mono text-purple-400 font-black tracking-widest block uppercase">
              // YENİ ÖZELLİK
            </span>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              Daha gelişmiş bir deneyim için tüm popüler oyuncu crosshairlerini test edebileceğiniz ve kendi nişangahınızı tasarlayabileceğiniz <span className="text-purple-400 font-bold">Özel Crosshair Panelini</span> oluşturduk!
            </p>
            <button
              onClick={() => onNavigateToSection?.("crosshair")}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
              <span>Gelişmiş Crosshair Panelini Aç</span>
            </button>
          </div>
        </div>
      )
    },
    {
      id: "radar",
      title: "Radar Ayarları",
      icon: <SlidersHorizontal className="h-4 w-4 text-indigo-400" />,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">CL_HUD_RADAR_SCALE</span>
              <span className="text-xs font-bold font-mono text-indigo-400">{settings.radarHudScale}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">CL_RADAR_SCALE</span>
              <span className="text-xs font-bold font-mono text-indigo-400">{settings.radarScale}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">CL_RADAR_ROTATE</span>
              <span className="text-xs font-bold font-mono text-indigo-400">{settings.radarRotate}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-[#0e0f17] border border-white/5">
              <span className="text-[11px] font-bold font-mono text-gray-500 uppercase">CL_RADAR_ICON_SCALE_MIN</span>
              <span className="text-xs font-bold font-mono text-indigo-400">{settings.radarIconScaleMin}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-[10px] font-mono text-gray-500 font-bold mb-2 uppercase tracking-wide">
              // Konsola yapıştır – ayarları direkt uygula!
            </p>
            <button
              onClick={() => handleCopy(settings.radarConsoleCode, "radar")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider hover:bg-indigo-500 hover:text-white transition-all duration-200"
            >
              {copiedKey === "radar" ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>KOD KOPYALANDI!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>KODU KOPYALA</span>
                </>
              )}
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="settings" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-20 left-10 w-[250px] h-[250px] rounded-full purple-glow pointer-events-none -z-10 opacity-20" />
      <div className="absolute bottom-20 right-10 w-[200px] h-[200px] rounded-full pink-glow pointer-events-none -z-10 opacity-20" />

      {/* Main Grid: Left side/Top is Video, Right side/Bottom is Settings list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Video Block (Mock Smartphone Layout as requested & shown in screenshots) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full max-w-[340px] space-y-4">
            
            {/* GELİŞMİŞ GÖRÜNTÜ AYARLARIM Header */}
            <div className="w-full text-center py-3.5 px-4 rounded-2xl bg-[#0e1017]/80 border border-white/5 shadow-lg flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
              <span className="text-[11px] font-black tracking-widest text-purple-400 uppercase">
                GELİŞMİŞ GÖRÜNTÜ AYARLARIM
              </span>
            </div>

            {/* Smartphone frame container */}
            <div className="relative mx-auto w-full aspect-[9/16] rounded-[42px] border-[10px] border-[#181a26] bg-[#0c0d14] shadow-2xl overflow-hidden flex flex-col justify-between group">
              {/* Dynamic Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#181a26] rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-black/60 rounded-full" />
              </div>

              {/* Inside Screen Content */}
              <div className="absolute inset-0 h-full w-full z-10">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="CS2 Settings Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  // Default placeholder mockup as shown in the screenshot when no video URL is saved
                  <div className="w-full h-full flex flex-col justify-between p-6 relative">
                    {/* Soft background glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-black/90 pointer-events-none" />
                    
                    {/* Header in phone */}
                    <div className="pt-4 flex justify-between items-center z-10">
                      <span className="text-[10px] font-bold font-mono tracking-wider text-purple-400 uppercase">
                        KICK.COM/{siteName.toUpperCase()}
                      </span>
                    </div>

                    {/* Big central play container */}
                    <div className="my-auto flex flex-col items-center justify-center space-y-4 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                        <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
                          <Play className="h-8 w-8 text-white fill-white ml-1" />
                        </div>
                      </div>

                      <div className="text-center px-4 space-y-1">
                        <h4 className="text-lg font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-wide leading-tight uppercase">
                          COUNTER STRIKE 2
                        </h4>
                        <p className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">
                          GÜNCEL AYARLARIM
                        </p>
                      </div>
                    </div>

                    {/* Bottom Label in phone */}
                    <div className="pb-2 text-center z-10">
                      <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">
                        // Admin panelinden video url'si ekleyin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Label below smartphone */}
            <div className="text-center">
              <p className="text-[11px] font-mono text-gray-500 font-bold tracking-widest uppercase">
                // VİDEO – CS2 GÜNCEL AYARLARIM
              </p>
            </div>

          </div>

        </div>

        {/* Settings Accordion Stack */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header */}
          <div className="space-y-1">
            <span className="font-mono text-xs text-purple-400 font-black tracking-widest block uppercase">
              // {siteName} AYARLARI
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-white uppercase flex items-center gap-2">
              <span>{siteName} - AYARLAR</span>
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse hidden sm:inline" />
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">
              CS2'DE KULLANDIĞIM TÜM AYARLAR
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-1">
            <span className="font-mono text-xs text-gray-500 font-bold tracking-widest block uppercase">
              // AYAR LİSTESİ
            </span>
            
            <div className="space-y-3 pt-2">
              {accordions.map((item) => {
                const isOpen = activeAccordion === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-[#11121d]/90 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[1.01]"
                        : "bg-[#0e1017]/80 border-white/5 hover:border-purple-500/10 hover:bg-[#11121d]/50"
                    }`}
                  >
                    {/* Accordion Toggle Header */}
                    <button
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full flex items-center justify-between p-4 focus:outline-none"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all ${
                          isOpen
                            ? "bg-purple-500/20 border-purple-500/40 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                            : "bg-white/5 border-white/5 text-gray-400"
                        }`}>
                          {item.icon}
                        </div>
                        <span className={`text-sm font-black uppercase tracking-wider transition ${
                          isOpen ? "text-white" : "text-gray-300"
                        }`}>
                          {item.title}
                        </span>
                      </div>

                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-purple-400" : ""
                      }`} />
                    </button>

                    {/* Accordion Expanded Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="p-4 pt-0 border-t border-white/5 bg-black/20">
                            {item.content}
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

      </div>
    </section>
  );
}
