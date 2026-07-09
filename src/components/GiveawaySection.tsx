import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Users, Trophy, Sparkles, Plus, Trash2, Play, AlertCircle, RefreshCw, Star, CheckCircle2 } from "lucide-react";
import { TranslationDict, GiveawayItem } from "../types";
import { DEFAULT_GIVEAWAYS } from "../data";

interface GiveawaySectionProps {
  translations: TranslationDict;
  lang: "TR" | "EN";
  currentUser: any;
}

export default function GiveawaySection({ translations, lang, currentUser }: GiveawaySectionProps) {
  const [giveaways, setGiveaways] = useState<GiveawayItem[]>(() => {
    const saved = localStorage.getItem("weew_giveaways");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_GIVEAWAYS;
  });

  const [activeGiveaway, setActiveGiveaway] = useState<GiveawayItem | null>(null);
  const [completedGiveaways, setCompletedGiveaways] = useState<GiveawayItem[]>([]);
  const [nickname, setNickname] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Custom creator states
  const [showCreator, setShowCreator] = useState(false);
  const [customPrize, setCustomPrize] = useState("");
  const [customDescTR, setCustomDescTR] = useState("");
  const [customDescEN, setCustomDescEN] = useState("");

  // Drawing animation states
  const [isDrawing, setIsDrawing] = useState(false);
  const [spinIndex, setSpinIndex] = useState(-1);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [spinList, setSpinList] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Split active and completed
  useEffect(() => {
    const active = giveaways.find(g => g.status === "active") || null;
    const completed = giveaways.filter(g => g.status === "completed" || g.status === "cancelled");
    setActiveGiveaway(active);
    setCompletedGiveaways(completed.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()));

    // check if user has joined active
    if (active) {
      const userKey = currentUser ? currentUser.name : localStorage.getItem("weew_giveaway_anon_name") || "";
      if (userKey && active.entrants.includes(userKey)) {
        setHasJoined(true);
      } else {
        setHasJoined(false);
      }
    }
  }, [giveaways, currentUser]);

  // Real-time synchronization with Admin Panel
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("weew_giveaways");
      if (saved) {
        try {
          setGiveaways(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener("weew_giveaway_update", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("weew_giveaway_update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Real-time join simulator
  // Every 8-12 seconds, add a mock CS2 player to make the giveaway feel extremely active
  useEffect(() => {
    if (!activeGiveaway || isDrawing) return;

    const botNames = [
      "cs2_pro_99", "kick_enjoyer", "faceit_demon", "shroud_junior", "heatoN_fan", 
      "lozan_fani", "unlost_pro", "cs2_caner", "reaper_cs", "s1mple_junior", 
      "headshot_machine", "berk_pasha", "wooting_keyboard_user", "aimstar", "toxic_clutcher",
      "rush_b_dont_stop", "flashbang_enjoyer", "dragon_lore_owner", "hyper_beast"
    ];

    const interval = setInterval(() => {
      // Find a bot name that hasn't joined yet
      const availableBots = botNames.filter(name => !activeGiveaway.entrants.includes(name));
      if (availableBots.length === 0) return;

      const randomBot = availableBots[Math.floor(Math.random() * availableBots.length)];

      setGiveaways(prev => prev.map(g => {
        if (g.id === activeGiveaway.id) {
          return {
            ...g,
            entrants: [...g.entrants, randomBot]
          };
        }
        return g;
      }));
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [activeGiveaway, isDrawing]);

  // Save giveaways to local storage
  const saveAndSetGiveaways = (updated: GiveawayItem[]) => {
    setGiveaways(updated);
    localStorage.setItem("weew_giveaways", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("weew_giveaway_update"));
  };

  const handleJoinGiveaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGiveaway) return;

    const joinerName = currentUser ? currentUser.name : nickname.trim();
    if (!joinerName) {
      setErrorMessage(lang === "TR" ? "Lütfen geçerli bir isim girin!" : "Please enter a valid name!");
      return;
    }

    if (activeGiveaway.entrants.includes(joinerName)) {
      setErrorMessage(lang === "TR" ? "Bu çekilişe zaten katıldınız!" : "You have already joined this raffle!");
      return;
    }

    // Add entrant
    const updated = giveaways.map(g => {
      if (g.id === activeGiveaway.id) {
        return {
          ...g,
          entrants: [...g.entrants, joinerName]
        };
      }
      return g;
    });

    saveAndSetGiveaways(updated);
    setHasJoined(true);
    setErrorMessage("");
    if (!currentUser) {
      localStorage.setItem("weew_giveaway_anon_name", joinerName);
    }
  };

  // Run raffle drawing (Synchronized live version)
  const handleDrawRaffle = (precomputed?: { winner: string; winningIndex: number; spinList: string[] }) => {
    if (!activeGiveaway || activeGiveaway.entrants.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setWinnerName(null);
    setShowConfetti(false);

    let winner = "";
    let winningIndex = 0;
    let spinStrip: string[] = [];

    if (precomputed) {
      winner = precomputed.winner;
      winningIndex = precomputed.winningIndex;
      spinStrip = precomputed.spinList;
    } else {
      // Only Admins can officially initiate a drawing
      if (currentUser?.role !== "admin") return;

      const list = [...activeGiveaway.entrants];
      const shuffledList = [...list].sort(() => Math.random() - 0.5);
      
      while (spinStrip.length < 50) {
        spinStrip = [...spinStrip, ...shuffledList.sort(() => Math.random() - 0.5)];
      }

      winningIndex = Math.floor(Math.random() * 8) + 38; // somewhere between 38 and 45
      winner = spinStrip[winningIndex];

      // Broadcast the drawing trigger to everyone instantly
      const trigger = {
        giveawayId: activeGiveaway.id,
        winner,
        winningIndex,
        spinList: spinStrip,
        timestamp: Date.now()
      };
      localStorage.setItem("weew_active_spin_trigger", JSON.stringify(trigger));
      window.dispatchEvent(new CustomEvent("weew_active_spin_trigger_fired", { detail: trigger }));
    }

    setSpinList(spinStrip);

    // Animation interval loop
    let currentIndex = 0;
    let speed = 40; // initial speed ms

    const runSpin = () => {
      setSpinIndex(currentIndex);
      if (currentIndex >= winningIndex) {
        // Landed!
        setTimeout(() => {
          setWinnerName(winner);
          setShowConfetti(true);
          setIsDrawing(false);

          // Only the admin commits the official completed state to local storage
          if (currentUser?.role === "admin") {
            const updated = giveaways.map(g => {
              if (g.id === activeGiveaway.id) {
                return {
                  ...g,
                  status: "completed" as const,
                  winner: winner,
                  endTime: new Date().toISOString()
                };
              }
              return g;
            });
            saveAndSetGiveaways(updated);
          }
        }, 800);
        return;
      }

      currentIndex++;
      
      // Calculate slowing down speed curve
      const remaining = winningIndex - currentIndex;
      if (remaining < 15) {
        speed += 18;
      } else if (remaining < 5) {
        speed += 45;
      } else {
        speed += 2;
      }

      setTimeout(runSpin, speed);
    };

    runSpin();
  };

  // Listen for live broadcasted drawing triggers
  useEffect(() => {
    const handleDrawTrigger = (e: any) => {
      const triggerData = e.detail || e;
      if (triggerData && triggerData.giveawayId && activeGiveaway && triggerData.giveawayId === activeGiveaway.id) {
        // Double check to prevent starting another spin animation if already in progress
        if (!isDrawing) {
          handleDrawRaffle(triggerData);
        }
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "weew_active_spin_trigger" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const lastTriggered = localStorage.getItem("weew_last_triggered_spin") || "0";
          if (data.timestamp > parseInt(lastTriggered, 10)) {
            localStorage.setItem("weew_last_triggered_spin", data.timestamp.toString());
            window.dispatchEvent(new CustomEvent("weew_active_spin_trigger_fired", { detail: data }));
          }
        } catch (err) {
          // ignore
        }
      }
    };

    const handleLocalTrigger = (e: CustomEvent) => {
      handleDrawTrigger(e);
    };

    window.addEventListener("weew_active_spin_trigger_fired", handleLocalTrigger as EventListener);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("weew_active_spin_trigger_fired", handleLocalTrigger as EventListener);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [activeGiveaway, isDrawing, giveaways]);

  // Reset or start custom giveaway
  const handleCreateCustomGiveaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== "admin") {
      alert(lang === "TR" ? "Sadece yöneticiler çekiliş oluşturabilir!" : "Only administrators can create giveaways!");
      return;
    }
    if (customPrize.trim() === "") return;

    // Terminate any active giveaway first
    const cleanList = giveaways.map(g => {
      if (g.status === "active") {
        return {
          ...g,
          status: "cancelled" as const,
          endTime: new Date().toISOString()
        };
      }
      return g;
    });

    const newGiveaway: GiveawayItem = {
      id: `giveaway-${Date.now()}`,
      prize: customPrize,
      descriptionTR: customDescTR || "Özel topluluk çekilişi! Hemen adını yazdırıp şansını dene.",
      descriptionEN: customDescEN || "Special community giveaway! Put down your name and test your luck.",
      endTime: new Date(Date.now() + 1800000).toISOString(), // 30 mins
      status: "active" as const,
      winner: null,
      entrants: currentUser ? [currentUser.name] : [],
      createdAt: new Date().toISOString()
    };

    saveAndSetGiveaways([newGiveaway, ...cleanList]);
    setCustomPrize("");
    setCustomDescTR("");
    setCustomDescEN("");
    setShowCreator(false);
  };

  const handleDeleteGiveaway = (id: string) => {
    if (currentUser?.role !== "admin") {
      alert(lang === "TR" ? "Sadece yöneticiler çekiliş silebilir!" : "Only administrators can delete giveaways!");
      return;
    }
    const filtered = giveaways.filter(g => g.id !== id);
    saveAndSetGiveaways(filtered);
  };

  const handleResetToDefaults = () => {
    if (currentUser?.role !== "admin") {
      alert(lang === "TR" ? "Sadece yöneticiler çekiliş verilerini sıfırlayabilir!" : "Only administrators can reset giveaway data!");
      return;
    }
    if (confirm(lang === "TR" ? "Çekiliş verilerini sıfırlamak istiyor musunuz?" : "Do you want to reset giveaways to defaults?")) {
      saveAndSetGiveaways(DEFAULT_GIVEAWAYS);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="giveaways-tab-container">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-black text-purple-400 uppercase tracking-widest block mb-1">
            🎁 {translations.giveawaySub}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            {translations.giveawayTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === "admin" && (
            <button
              onClick={() => setShowCreator(!showCreator)}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-wider px-4 py-2.5 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {lang === "TR" ? "Çekiliş Oluştur" : "Create Raffle"}
            </button>
          )}

          {currentUser?.role === "admin" && (
            <button
              onClick={handleResetToDefaults}
              className="flex items-center justify-center rounded-xl border border-white/5 bg-[#12131a] hover:bg-white/5 text-gray-400 hover:text-white p-2.5 transition cursor-pointer"
              title={lang === "TR" ? "Varsayılana Sıfırla" : "Reset to Defaults"}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Admin Creator Form Dropdown */}
      <AnimatePresence>
        {showCreator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handleCreateCustomGiveaway}
              className="p-6 rounded-3xl border border-purple-500/20 bg-[#12131a]/80 backdrop-blur-md space-y-4"
            >
              <h3 className="font-display text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00e676]" />
                {lang === "TR" ? "Yeni CS2 Skin Çekilişi Başlat" : "Start New CS2 Skin Raffle"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-black">
                    {lang === "TR" ? "Hediye / Ödül Adı" : "Prize / Skin Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customPrize}
                    onChange={e => setCustomPrize(e.target.value)}
                    placeholder="e.g. AK-47 | Empress (Minimal Wear)"
                    className="w-full rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-black">
                    {lang === "TR" ? "Başlangıç Katılımcısı" : "Initial Participant"}
                  </label>
                  <div className="text-xs text-purple-400 font-mono py-3">
                    {lang === "TR" ? "Oluşturulduğunda siz otomatik olarak ekleneceksiniz." : "You will be automatically added upon creation."}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-black">
                    Açıklama (Türkçe)
                  </label>
                  <textarea
                    value={customDescTR}
                    onChange={e => setCustomDescTR(e.target.value)}
                    placeholder="Bu harika kaplamayı kazanmak için..."
                    className="w-full h-20 rounded-xl bg-black/40 border border-white/5 p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-black">
                    Description (English)
                  </label>
                  <textarea
                    value={customDescEN}
                    onChange={e => setCustomDescEN(e.target.value)}
                    placeholder="To win this amazing skin..."
                    className="w-full h-20 rounded-xl bg-black/40 border border-white/5 p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreator(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition"
                >
                  {lang === "TR" ? "Vazgeç" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 text-xs font-black uppercase tracking-wider transition"
                >
                  {lang === "TR" ? "Çekilişi Yayına Al" : "Publish Giveaway"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Giveaway Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Giveaway Section (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {activeGiveaway ? (
            <div className="p-6 rounded-3xl border border-white/5 bg-[#12131a]/60 backdrop-blur-sm relative overflow-hidden space-y-6">
              
              {/* Glowing decorative ambient corner */}
              <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00e676]/10 px-3 py-1 border border-[#00e676]/20 text-[#00e676] text-[10px] font-mono font-black uppercase tracking-wider mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00e676] animate-pulse" />
                    {lang === "TR" ? "AKTİF KATILIM" : "ACTIVE RAFFLE"}
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                    {activeGiveaway.prize}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed mt-2 max-w-2xl">
                    {lang === "TR" ? activeGiveaway.descriptionTR : activeGiveaway.descriptionEN}
                  </p>
                </div>

                <div className="shrink-0 flex sm:flex-col items-end gap-1 font-mono">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">{lang === "TR" ? "KATILAN" : "ENTRANTS"}</span>
                  <span className="text-2xl font-black text-purple-400 flex items-center gap-1.5">
                    <Users className="h-5 w-5 text-purple-400" />
                    {activeGiveaway.entrants.length}
                  </span>
                </div>
              </div>

              {/* Enter giveaway widget */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                {hasJoined ? (
                  <div className="flex items-center gap-3 text-[#00e676]">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        {lang === "TR" ? "Çekiliş Listesindesiniz!" : "You are in the list!"}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {lang === "TR" 
                          ? "Adınız listeye başarıyla eklendi. Yayıncının kurayı çekmesini bekleyin." 
                          : "Your name was registered successfully. Wait for the host to draw the winner."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleJoinGiveaway} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                        required
                        disabled={!!currentUser}
                        placeholder={currentUser ? currentUser.name : (lang === "TR" ? "Sohbet Takma Adınızı Girin" : "Enter Chat Nickname")}
                        className="w-full h-11 rounded-xl bg-[#12131a] border border-white/5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-11 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-black text-xs uppercase tracking-wider px-6 transition shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gift className="h-4 w-4" />
                      {lang === "TR" ? "Çekilişe Katıl" : "Join Raffle"}
                    </button>
                  </form>
                )}
                {errorMessage && (
                  <p className="text-xs text-red-400 font-mono mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* ROULETTE TICKER SPINNER (Interactive animation panel) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-mono text-gray-400 uppercase font-black tracking-widest">
                    {lang === "TR" ? "⚡ KURA SİMÜLASYONU VE ÇARKI" : "⚡ DRAW WHEEL & SIMULATION"}
                  </h4>

                  {currentUser?.role === "admin" ? (
                    <button
                      onClick={() => handleDrawRaffle()}
                      disabled={activeGiveaway.entrants.length === 0 || isDrawing}
                      className="flex items-center gap-1.5 rounded-lg bg-[#00e676] hover:bg-[#00c853] text-black font-black uppercase text-[10px] tracking-wider px-3.5 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      {lang === "TR" ? "Çekilişi Yap" : "Draw Winner"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-purple-400 text-[10px] font-mono font-black uppercase tracking-wider animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
                      {lang === "TR" ? "Yayıncının Kurayı Çekmesi Bekleniyor" : "Waiting for Host to Draw"}
                    </div>
                  )}
                </div>

                {/* Roller Container */}
                <div className="relative w-full h-16 rounded-2xl bg-black/80 border border-[#00e676]/20 overflow-hidden flex items-center justify-center">
                  {/* Vertical indicator needle line */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-[3px] bg-[#00e676] z-20 shadow-[0_0_10px_#00e676]">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#00e676]" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#00e676]" />
                  </div>

                  {isDrawing && spinList.length > 0 ? (
                    <div 
                      className="flex gap-1 items-center transition-all duration-75 px-4"
                      style={{
                        transform: `translateX(calc(-${spinIndex * 134}px + 50% - 67px))`
                      }}
                    >
                      {spinList.map((entrant, idx) => (
                        <div
                          key={idx}
                          className={`w-[130px] h-10 shrink-0 rounded-lg flex items-center justify-center font-mono font-bold text-xs uppercase transition border ${
                            spinIndex === idx
                              ? "bg-purple-500/20 border-purple-500 text-white font-black"
                              : "bg-[#111218]/80 border-white/5 text-gray-500"
                          }`}
                        >
                          <span className="truncate px-2">{entrant}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest text-center px-4">
                      {isDrawing 
                        ? (lang === "TR" ? "Biletler karıştırılıyor..." : "Shuffling entries...")
                        : (lang === "TR" 
                          ? "Kura butonuna basın ve çarkı çevirin!" 
                          : "Press the Draw button to spin the wheel!")
                      }
                    </div>
                  )}
                </div>

                {/* Celebratory Winner Screen */}
                <AnimatePresence>
                  {winnerName && showConfetti && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-6 rounded-2xl border-2 border-dashed border-[#00e676] bg-[#00e676]/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                      {/* Floating custom star confetti */}
                      <div className="absolute inset-0 pointer-events-none opacity-40">
                        <div className="absolute top-2 left-6 animate-bounce text-yellow-400">★</div>
                        <div className="absolute top-8 right-12 animate-pulse text-purple-400">✦</div>
                        <div className="absolute bottom-4 left-1/4 animate-ping text-[#00e676] text-xs">⭐</div>
                        <div className="absolute bottom-6 right-1/4 animate-bounce text-pink-400">★</div>
                      </div>

                      <Trophy className="h-10 w-10 text-yellow-400 mb-2 animate-bounce" />
                      <h4 className="text-xs font-mono font-black text-[#00e676] uppercase tracking-wider">
                        {lang === "TR" ? "ÇEKİLİŞ SONUÇLANDI!" : "RAFFLE CONCLUDED!"}
                      </h4>
                      <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                        🏆 {winnerName}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1 max-w-md">
                        {lang === "TR" 
                          ? `Tebrikler! ${winnerName} adlı izleyicimiz "${activeGiveaway.prize}" ödülünü kazandı!` 
                          : `Congratulations! ${winnerName} has won the "${activeGiveaway.prize}"!`}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Real-time ticker entrants bubble */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-widest block">
                    {lang === "TR" ? "KATILIMCI ADAYLARI" : "ENTRANT CANDIDATES"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto scrollbar-thin p-1">
                    {activeGiveaway.entrants.map((entrant, i) => (
                      <span 
                        key={i} 
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider border transition ${
                          entrant === currentUser?.name 
                            ? "bg-[#00e676]/10 border-[#00e676]/30 text-[#00e676]" 
                            : "bg-[#161720] border-white/5 text-gray-400"
                        }`}
                      >
                        👤 {entrant}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-white/10 bg-[#12131a]/30 text-center flex flex-col items-center justify-center space-y-3">
              <Gift className="h-12 w-12 text-gray-600 animate-pulse" />
              <div>
                <h3 className="font-display text-md font-bold text-gray-400 uppercase tracking-wide">
                  {lang === "TR" ? "Aktif Çekiliş Bulunmuyor" : "No Active Giveaway"}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  {lang === "TR" 
                    ? "Şu anda yayında aktif bir çekiliş yok. Admin panelinden veya yukarıdan yeni bir çekiliş başlatabilirsiniz." 
                    : "No active giveaways running. You can initiate a custom one from the trigger button above."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Past completed giveaways (Right 1 column) */}
        <div className="space-y-4">
          <h3 className="font-display text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="h-4.5 w-4.5 text-yellow-500" />
            {lang === "TR" ? "Geçmiş Çekilişler" : "Completed Giveaways"}
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
            {completedGiveaways.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono italic">
                {lang === "TR" ? "Henüz sonuçlanmış çekiliş yok." : "No completed giveaways yet."}
              </p>
            ) : (
              completedGiveaways.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl border border-white/5 bg-[#12131a]/80 space-y-2.5 relative group"
                >
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={() => handleDeleteGiveaway(item.id)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                      title={lang === "TR" ? "Sil" : "Delete"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-purple-400 uppercase font-black">
                      {item.status === "cancelled" ? (
                        <span className="text-red-400">{lang === "TR" ? "İPTAL EDİLDİ" : "CANCELLED"}</span>
                      ) : (
                        <span className="text-green-400">{lang === "TR" ? "TAMAMLANDI" : "CONCLUDED"}</span>
                      )}
                    </span>
                    <h4 className="font-display text-xs sm:text-sm font-extrabold text-white truncate max-w-[180px]">
                      {item.prize}
                    </h4>
                  </div>

                  {item.status !== "cancelled" && (
                    <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-current shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] text-gray-500 font-mono uppercase block">{lang === "TR" ? "KAZANAN" : "WINNER"}</span>
                        <span className="text-xs font-mono font-black text-yellow-400 truncate block">
                          {item.winner}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                    <span>{item.entrants.length} {lang === "TR" ? "Katılımcı" : "Entrants"}</span>
                    <span>{new Date(item.endTime).toLocaleDateString(lang === "TR" ? "tr-TR" : "en-US")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
