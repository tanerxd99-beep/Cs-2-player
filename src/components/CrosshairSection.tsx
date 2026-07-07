import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Copy, Check, Search, HelpCircle, ChevronRight, ChevronDown 
} from "lucide-react";
import { TranslationDict, CrosshairItem } from "../types";
import { CS2SettingsData } from "./CS2SettingsSection";

interface CrosshairSectionProps {
  translations: TranslationDict;
  settings: CS2SettingsData;
  siteName: string;
  profilePhoto?: string;
  crosshairs?: CrosshairItem[];
}

export const DEFAULT_CROSSHAIRS: CrosshairItem[] = [
  // Group 1: CROSSHAIR LİSTESİ
  {
    id: "beyaz-kucuk",
    name: "Beyaz Küçük Cross",
    code: "CSGO-szhkk-FyTEc-rXaqy-yBozL-4J3ED",
    type: "small",
    color: "#ffffff",
    size: 2,
    gap: -3,
    thickness: 1,
    outline: true,
    group: "main",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "beyaz-normal",
    name: "Beyaz Cross",
    code: "CSGO-KmQzd-hmeUU-eOR6w-FN4yd-YCdRF",
    type: "regular",
    color: "#ffffff",
    size: 3,
    gap: -2,
    thickness: 1,
    outline: true,
    group: "main",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "mavi-normal",
    name: "Mavi Cross",
    code: "CSGO-veFeH-tnBmA-OyRXu-YTbYX-iGAfD",
    type: "regular",
    color: "#00e5ff",
    size: 2.5,
    gap: -1,
    thickness: 1.2,
    outline: true,
    group: "main",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "wicadia",
    name: "Wicadia Cross",
    code: "CSGO-WQhyz-JcvVK-Y9ptw-H56mk-37QmH",
    type: "regular",
    color: "#00ff33",
    size: 2.5,
    gap: -2,
    thickness: 1,
    outline: true,
    group: "main",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "mavi-nokta",
    name: "Mavi Nokta Cross",
    code: "CSGO-GaNEQ-dQ2YA-QOtr4-a2tAj-mMN2G",
    type: "dot-cross",
    color: "#0066ff",
    size: 1.5,
    gap: -3,
    thickness: 1.5,
    outline: true,
    group: "main",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "beyaz-kalin",
    name: "Beyaz Kalın Cross",
    code: "CSGO-Y2uUb-2BSRW-mLYxZ-5YGop-BhiaB",
    type: "thick",
    color: "#ffffff",
    size: 3,
    gap: -1,
    thickness: 2.5,
    outline: true,
    group: "main",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "mavi-alt",
    name: "Mavi Cross",
    code: "CSGO-FAFJV-EHLQr-QoiRh-yTzNV-xbM2G",
    type: "regular",
    color: "#0066ff",
    size: 2.5,
    gap: -1,
    thickness: 1.2,
    outline: false,
    group: "main"
  },
  {
    id: "nokta",
    name: "Nokta Cross",
    code: "CSGO-ZpJTc-uyByC-sWfyB-9MOUG-4J3ED",
    type: "dot",
    color: "#0066ff",
    size: 2.5,
    gap: 0,
    thickness: 2.5,
    outline: true,
    group: "main"
  },

  // Group 2: CROSS SERİSİ - BEĞENİLEN CROSS KODLARI
  {
    id: "kirmizi",
    name: "Kırmızı Cross",
    code: "CSGO-vs5hj-dFmQd-Pa9Xn-sATFA-2ECtG",
    type: "regular",
    color: "#ff3b30",
    size: 3.5,
    gap: -2,
    thickness: 1,
    outline: true,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "acik-mavi",
    name: "Açık Mavi Cross",
    code: "CSGO-S3crj-Lsv8x-dPyNt-fo6zW-fcEBM",
    type: "regular",
    color: "#00e5ff",
    size: 3,
    gap: -2,
    thickness: 1,
    outline: false,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "acik-mavi-kucuk",
    name: "Açık Mavi Küçük Cross",
    code: "CSGO-HSdRz-mashF-aA55z-iKZud-pzJzN",
    type: "small",
    color: "#00e5ff",
    size: 1.8,
    gap: -3,
    thickness: 1,
    outline: true,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "beyaz-liked",
    name: "Beyaz Cross",
    code: "CSGO-vytxc-tjaP4-EEDhQ-riKa6-MqNkO",
    type: "regular",
    color: "#ffffff",
    size: 3,
    gap: -2,
    thickness: 1,
    outline: false,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "sari-kucuk",
    name: "Sarı Küçük Cross",
    code: "CSGO-zC97q-EPnMN-nwc2y-N9ta9-WsdqA",
    type: "small",
    color: "#ffcc00",
    size: 2,
    gap: -2,
    thickness: 1,
    outline: false,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "mavi-liked",
    name: "Mavi Cross",
    code: "CSGO-3zBNN-Noo3x-7nH7e-Y9wqx-aQSFE",
    type: "regular",
    color: "#0066ff",
    size: 3,
    gap: -1,
    thickness: 1.5,
    outline: true,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "yesil-kucuk",
    name: "Yeşil Küçük Cross",
    code: "CSGO-kfi33-uWfoP-GJCiN-3sNCx-zwsyM",
    type: "small",
    color: "#00e676",
    size: 2,
    gap: -3,
    thickness: 1,
    outline: true,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  },
  {
    id: "duz-beyaz-arti",
    name: "Düz Beyaz Artı Cross",
    code: "CSGO-hCN5b-jZ4xb-GQwVH-zxUsN-nvHCF",
    type: "plus",
    color: "#ffffff",
    size: 4,
    gap: -4,
    thickness: 1.5,
    outline: false,
    group: "liked",
    videoUrl: "https://youtube.com/@talimera"
  }
];

export default function CrosshairSection({ translations, settings, siteName, profilePhoto, crosshairs = [] }: CrosshairSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const handleCopy = (code: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion when copying
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter crosshair items based on search query
  const actualCrosshairs = crosshairs && crosshairs.length > 0 ? crosshairs : DEFAULT_CROSSHAIRS;
  const filteredCrosshairs = actualCrosshairs.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const mainGroup = filteredCrosshairs.filter(item => item.group === "main");
  const likedGroup = filteredCrosshairs.filter(item => item.group === "liked");

  // Renders the actual vector crosshair scaled down inside the list row icon box
  const renderMiniCrosshair = (item: CrosshairItem) => {
    const itemColor = item.color;
    const itemSize = item.size || 2.5;
    const itemGap = item.gap || -2;
    const itemThickness = item.thickness || 1.2;
    const itemOutline = item.outline ?? true;
    const hasDot = item.type === "dot" || item.type === "dot-cross";
    const hasLines = item.type !== "dot";

    return (
      <div className="relative w-8 h-8 flex items-center justify-center scale-[0.55] pointer-events-none">
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

        <div className="relative flex items-center justify-center">
          {hasDot && (
            <div 
              className="rounded-full shadow-sm z-10" 
              style={{ 
                backgroundColor: itemColor,
                width: `${itemSize * 2.2}px`, 
                height: `${itemSize * 2.2}px`,
              }} 
            />
          )}
          {hasLines && (
            <>
              <div 
                className="absolute shadow-sm"
                style={{
                  backgroundColor: itemColor,
                  width: `${itemThickness}px`,
                  height: `${itemSize * 5}px`,
                  transform: `translateY(${-itemGap - itemSize * 2.5}px)`
                }}
              />
              <div 
                className="absolute shadow-sm"
                style={{
                  backgroundColor: itemColor,
                  width: `${itemThickness}px`,
                  height: `${itemSize * 5}px`,
                  transform: `translateY(${itemGap + itemSize * 2.5}px)`
                }}
              />
              <div 
                className="absolute shadow-sm"
                style={{
                  backgroundColor: itemColor,
                  width: `${itemSize * 5}px`,
                  height: `${itemThickness}px`,
                  transform: `translateX(${-itemGap - itemSize * 2.5}px)`
                }}
              />
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
      </div>
    );
  };

  const renderAccordionItem = (item: CrosshairItem) => {
    const isOpen = !!expandedIds[item.id];

    return (
      <div 
        key={item.id}
        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
          isOpen 
            ? "border-purple-500/30 bg-[#121320]/95 shadow-[0_0_20px_rgba(168,85,247,0.06)]" 
            : "border-white/[0.03] bg-[#0c0d15]/80 hover:border-white/10 hover:bg-[#0e0f1b]/90"
        }`}
      >
        {/* Row Header */}
        <div 
          onClick={() => toggleExpand(item.id)}
          className="flex items-center justify-between p-4 cursor-pointer select-none"
        >
          <div className="flex items-center space-x-4">
            {/* Real-time Preview Box */}
            <div className="relative w-10 h-10 rounded-xl bg-[#05060b] border border-white/[0.08] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:6px_6px]" />
              {item.customIcon ? (
                <img 
                  src={item.customIcon} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                renderMiniCrosshair(item)
              )}
            </div>
            
            <span className="text-sm font-bold text-gray-200 tracking-wide font-sans">
              {item.name}
            </span>
          </div>

          <div className="text-gray-500 pr-1">
            {isOpen ? <ChevronDown className="h-4 w-4 text-purple-400" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5 pt-0 border-t border-white/[0.04]">
                <div className="h-px bg-white/[0.02] mb-4" />
                
                <span className="text-[10px] font-mono text-gray-500 font-extrabold tracking-widest block uppercase mb-2">
                  // CROSS KODU
                </span>

                {/* Buyur Kankam Code Block */}
                <div className="bg-[#05060a] rounded-xl border border-white/[0.03] p-4 border-l-[3px] border-purple-500 relative flex flex-col">
                  <span className="text-[9px] font-mono font-black text-gray-500 tracking-wider mb-2">
                    BUYUR KANKAM – CROSS KODU SENİNDİR.
                  </span>
                  <span className="text-xs md:text-sm font-mono font-bold break-all select-all text-purple-400 select-all tracking-wide">
                    {item.code}
                  </span>
                </div>

                {/* Optional Video Link */}
                {item.videoUrl && (
                  <div className="bg-[#08090f]/40 border border-white/[0.03] px-4 py-3 rounded-xl mt-3 text-[11px] font-mono text-gray-400 flex items-center justify-center space-x-1">
                    <span>// Videonun tamamını izlemek için</span>
                    <a 
                      href={item.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 underline cursor-pointer hover:text-purple-300 transition-colors font-bold ml-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      buraya tıkla
                    </a>
                  </div>
                )}

                {/* Copy Button */}
                <button
                  onClick={(e) => handleCopy(item.code, item.id, e)}
                  className={`w-full py-3 rounded-xl mt-4 flex items-center justify-center space-x-2 border transition-all duration-200 font-bold text-xs font-mono tracking-widest ${
                    copiedKey === item.id
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : "bg-purple-950/20 border-purple-500/20 text-purple-400 hover:bg-purple-600 hover:text-white"
                  }`}
                >
                  {copiedKey === item.id ? (
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 space-y-6" id="crosshair-section-container">
      
      {/* Top Profile Card matching real-world site */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 text-center">
        <div className="relative mb-4">
          {/* Subtle Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-purple-500/15 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-b from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <img 
              src={profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200"} 
              alt={siteName} 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h1 className="text-xl font-extrabold tracking-[0.15em] text-white uppercase font-sans">
          {siteName ? `${siteName.toUpperCase()} - CROSS` : "TALIMERA - CROSS"}
        </h1>
        <p className="text-[11px] font-mono font-black text-gray-400 tracking-[0.2em] uppercase mt-1">
          ABİ CROSS KODU NE?
        </p>
      </div>

      {/* Subtle, highly integrated Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Nişangah ara (Örn: Beyaz, Mavi, Nokta)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-[#090a12]/90 border border-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/40 font-bold placeholder-gray-600 transition-colors"
        />
      </div>

      {/* Crosshair Lists */}
      <div className="space-y-8">
        {searchQuery ? (
          /* Search results unified view */
          <div className="space-y-4">
            <span className="text-[11px] font-mono text-purple-400 font-extrabold tracking-widest block uppercase px-1">
              // ARAMA SONUÇLARI ({filteredCrosshairs.length})
            </span>
            {filteredCrosshairs.length > 0 ? (
              <div className="space-y-3">
                {filteredCrosshairs.map(renderAccordionItem)}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border border-white/[0.03] bg-[#0c0d15]/50">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  // ARADIĞINIZ KRİTERLERE UYGUN NİŞANGAH BULUNAMADI.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Standard grouped lists */
          <>
            {/* List 1: CROSSHAIR LİSTESİ */}
            {mainGroup.length > 0 && (
              <div className="space-y-4">
                <span className="text-[11px] font-mono text-purple-400 font-extrabold tracking-widest block uppercase px-1">
                  // CROSSHAIR LİSTESİ
                </span>
                <div className="space-y-3">
                  {mainGroup.map(renderAccordionItem)}
                </div>
              </div>
            )}

            {/* List 2: CROSS SERİSİ - BEĞENİLEN CROSS KODLARI */}
            {likedGroup.length > 0 && (
              <div className="space-y-4 pt-4">
                <span className="text-[11px] font-mono text-purple-400 font-extrabold tracking-widest block uppercase px-1">
                  // CROSS SERİSİ - BEĞENİLEN CROSS KODLARI
                </span>
                <div className="space-y-3">
                  {likedGroup.map(renderAccordionItem)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Help Section */}
      <div className="rounded-2xl border border-white/[0.03] bg-[#0c0d15]/40 p-5 max-w-xl mx-auto space-y-4 mt-8">
        <div className="flex items-center space-x-2 border-b border-white/[0.04] pb-3">
          <HelpCircle className="h-4 w-4 text-purple-400" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            NİŞANGAHI OYUNA NASIL EKLEYEBİLİRİM?
          </h4>
        </div>
        <ul className="space-y-3 text-[11px] text-gray-400 font-medium font-sans">
          <li className="flex items-start space-x-2.5">
            <span className="text-purple-400 font-black mt-0.5">1.</span>
            <span>İstediğiniz nişangahın altındaki <span className="text-white font-bold">KODU KOPYALA</span> butonuna tıklayın.</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <span className="text-purple-400 font-black mt-0.5">2.</span>
            <span>CS2 oyununu başlatın ve ana menüde sol üstteki dişli simgesine tıklayarak <span className="text-white font-bold">Oyun Ayarları</span>'na gidin.</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <span className="text-purple-400 font-black mt-0.5">3.</span>
            <span>Menünün üst kısmındaki sekmelerden <span className="text-white font-bold">Nişangah (Crosshair)</span> alanını seçin.</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <span className="text-purple-400 font-black mt-0.5">4.</span>
            <span>Önizleme görselinin altındaki <span className="text-purple-400 font-bold">Paylaş veya İçe Aktar</span> butonuna tıklayıp kopyaladığınız kodu yapıştırın ve <span className="text-emerald-400 font-bold">İçe Aktar</span> butonuna basın.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
