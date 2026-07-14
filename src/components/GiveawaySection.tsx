import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Users, Trophy, Sparkles, Plus, Trash2, Play, AlertCircle, RefreshCw, Star, CheckCircle2, User, HelpCircle } from "lucide-react";
import { TranslationDict, GiveawayItem } from "../types";
import { DEFAULT_GIVEAWAYS } from "../data";
import { triggerWebhook } from "../utils/webhookHelper";

export const AVATAR_PRESETS = [
  { url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=150&auto=format&fit=crop", label: "Sniper Pro" },
  { url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop", label: "Agency Agent" },
  { url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop", label: "CS2 General" },
  { url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=150&auto=format&fit=crop", label: "Entry Fragger" },
  { url: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150&auto=format&fit=crop", label: "Neon Phantom" },
  { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop", label: "Valkyrie CS" },
  { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop", label: "Stealth Rogue" },
  { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop", label: "Shadow Assassin" },
  { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop", label: "Tactical Leader" },
  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop", label: "Beast Mode" },
  { url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop", label: "Cyber Strike" },
  { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop", label: "Speed Demon" },
];

export const getSkinDetails = (prizeName: string) => {
  const parts = prizeName.split("|");
  const weapon = parts[0]?.trim() || "Süper Ödül";
  let skinWithWear = parts[1]?.trim() || "Özel Kaplama";
  
  let wear = "Factory New";
  let wearTR = "Fabrikadan Yeni Çıkmış";
  if (skinWithWear.includes("(")) {
    const wearPart = skinWithWear.substring(skinWithWear.indexOf("(") + 1, skinWithWear.indexOf(")"));
    wear = wearPart;
    skinWithWear = skinWithWear.substring(0, skinWithWear.indexOf("(")).trim();
  }
  
  if (wear.toLowerCase().includes("factory new") || wear.toLowerCase().includes("fn")) {
    wearTR = "Fabrikadan Yeni Çıkmış (FN)";
  } else if (wear.toLowerCase().includes("minimal wear") || wear.toLowerCase().includes("mw")) {
    wearTR = "Az Aşınmış (MW)";
  } else if (wear.toLowerCase().includes("field-tested") || wear.toLowerCase().includes("ft")) {
    wearTR = "Görevde Kullanılmış (FT)";
  } else if (wear.toLowerCase().includes("well-worn") || wear.toLowerCase().includes("ww")) {
    wearTR = "Eskimiş (WW)";
  } else if (wear.toLowerCase().includes("battle-scarred") || wear.toLowerCase().includes("bs")) {
    wearTR = "Savaş Yarası (BS)";
  } else {
    wearTR = wear;
  }

  let rarity = "Covert";
  let rarityTR = "Gizli (Covert)";
  let color = "#eb4b4b"; 
  let bgGradient = "from-[#eb4b4b]/20 via-[#eb4b4b]/5 to-transparent";

  const lowerName = prizeName.toLowerCase();
  if (lowerName.includes("temukau") || lowerName.includes("empress") || lowerName.includes("howl") || lowerName.includes("dragon lore") || lowerName.includes("fade") || lowerName.includes("hyper beast") || lowerName.includes("vulcan") || lowerName.includes("asiimov") || lowerName.includes("printstream")) {
    rarity = "Covert";
    rarityTR = "Gizli (Covert)";
    color = "#eb4b4b"; 
    bgGradient = "from-[#eb4b4b]/20 via-[#eb4b4b]/5 to-transparent";
  } else if (lowerName.includes("ice cooled") || lowerName.includes("redline") || lowerName.includes("frontside misty") || lowerName.includes("cyrex") || lowerName.includes("decimator")) {
    rarity = "Classified";
    rarityTR = "Gizemli (Classified)";
    color = "#d32ce6"; 
    bgGradient = "from-[#d32ce6]/20 via-[#d32ce6]/5 to-transparent";
  } else if (lowerName.includes("restricted") || lowerName.includes("slate") || lowerName.includes("nightwish") || lowerName.includes("atheris")) {
    rarity = "Restricted";
    rarityTR = "Yasaklı (Restricted)";
    color = "#8847ff"; 
    bgGradient = "from-[#8847ff]/20 via-[#8847ff]/5 to-transparent";
  } else {
    rarity = "Mil-Spec";
    rarityTR = "Askeri Sınıf (Mil-Spec)";
    color = "#4b69ff"; 
    bgGradient = "from-[#4b69ff]/20 via-[#4b69ff]/5 to-transparent";
  }

  // Generates consistent float based on character codes
  let hash = 0;
  for (let i = 0; i < prizeName.length; i++) {
    hash += prizeName.charCodeAt(i);
  }
  let floatVal = 0.03;
  if (wear.toLowerCase().includes("factory new")) {
    floatVal = 0.001 + (hash % 69) * 0.001;
  } else if (wear.toLowerCase().includes("minimal wear")) {
    floatVal = 0.07 + (hash % 79) * 0.001;
  } else if (wear.toLowerCase().includes("field-tested")) {
    floatVal = 0.15 + (hash % 229) * 0.001;
  } else if (wear.toLowerCase().includes("well-worn")) {
    floatVal = 0.38 + (hash % 69) * 0.001;
  } else {
    floatVal = 0.45 + (hash % 549) * 0.001;
  }

  return {
    weapon,
    skin: skinWithWear,
    wear,
    wearTR,
    rarity,
    rarityTR,
    color,
    bgGradient,
    float: floatVal.toFixed(4)
  };
};

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
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState(AVATAR_PRESETS[0].url);
  const [hasJoined, setHasJoined] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<string>("00:00");

  // Local sync stats for ticket shop integration
  const [guestNickname, setGuestNickname] = useState<string>(() => {
    return localStorage.getItem("weew_kick_guest_nick") || "Gezgin#1337";
  });

  const getPointsKey = () => {
    if (currentUser && currentUser.email) {
      return `weew_channel_points_${currentUser.email}`;
    }
    return `weew_channel_points_guest_${guestNickname}`;
  };

  const [channelPoints, setChannelPoints] = useState<number>(() => {
    const key = currentUser && currentUser.email
      ? `weew_channel_points_${currentUser.email}`
      : `weew_channel_points_guest_${localStorage.getItem("weew_kick_guest_nick") || "Gezgin#1337"}`;
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : 50;
  });

  // Keep channelPoints and nickname synchronized with LocalStorage / other components
  useEffect(() => {
    const handleSync = () => {
      const currentNick = localStorage.getItem("weew_kick_guest_nick") || "Gezgin#1337";
      setGuestNickname(currentNick);
      
      const key = currentUser && currentUser.email
        ? `weew_channel_points_${currentUser.email}`
        : `weew_channel_points_guest_${currentNick}`;
      const saved = localStorage.getItem(key);
      setChannelPoints(saved ? parseInt(saved, 10) : 50);
    };

    window.addEventListener("weew_points_update", handleSync);
    window.addEventListener("weew_chat_nick_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("weew_points_update", handleSync);
      window.removeEventListener("weew_chat_nick_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [currentUser]);

  // Live Countdown Timer logic
  useEffect(() => {
    if (!activeGiveaway) {
      setTimeLeft("00:00");
      return;
    }

    const updateTimer = () => {
      const diff = new Date(activeGiveaway.endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(lang === "TR" ? "SÜRE DOLDU" : "TIME'S UP");
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const hStr = hours > 0 ? `${hours}:` : "";
      const mStr = minutes < 10 ? `0${minutes}` : minutes;
      const sStr = seconds < 10 ? `0${seconds}` : seconds;

      setTimeLeft(`${hStr}${mStr}:${sStr}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeGiveaway, lang]);
  
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

  // Avatar lookup map loaded from localStorage
  const [entrantAvatars, setEntrantAvatars] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("weew_entrant_avatars") || "{}");
    } catch (e) {
      return {};
    }
  });

  // Keep state and localStorage in sync
  const saveEntrantAvatar = (name: string, url: string) => {
    const updated = { ...entrantAvatars, [name]: url };
    setEntrantAvatars(updated);
    localStorage.setItem("weew_entrant_avatars", JSON.stringify(updated));
  };

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

  // Ensure all entrants (active, past, bots) have mapped avatars
  useEffect(() => {
    let changed = false;
    const current = { ...entrantAvatars };

    if (activeGiveaway) {
      activeGiveaway.entrants.forEach((ent) => {
        if (!current[ent]) {
          const hash = ent.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          current[ent] = AVATAR_PRESETS[hash % AVATAR_PRESETS.length].url;
          changed = true;
        }
      });
    }

    completedGiveaways.forEach((g) => {
      g.entrants.forEach((ent) => {
        if (!current[ent]) {
          const hash = ent.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          current[ent] = AVATAR_PRESETS[hash % AVATAR_PRESETS.length].url;
          changed = true;
        }
      });
      if (g.winner && !current[g.winner]) {
        const hash = g.winner.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        current[g.winner] = AVATAR_PRESETS[hash % AVATAR_PRESETS.length].url;
        changed = true;
      }
    });

    if (changed) {
      setEntrantAvatars(current);
      localStorage.setItem("weew_entrant_avatars", JSON.stringify(current));
    }
  }, [activeGiveaway, completedGiveaways]);

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

      // Assign a random avatar preset to the bot
      const currentAvatars = JSON.parse(localStorage.getItem("weew_entrant_avatars") || "{}");
      const randomAvatar = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)].url;
      currentAvatars[randomBot] = randomAvatar;
      localStorage.setItem("weew_entrant_avatars", JSON.stringify(currentAvatars));
      
      // Dispatch update to sync layout
      setEntrantAvatars(currentAvatars);

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

    // Save user's selected preset avatar
    saveEntrantAvatar(joinerName, selectedPresetAvatar);

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
            
            // Trigger Webhook for winner
            triggerWebhook("giveaway_winner", {
              prize: activeGiveaway.prize,
              winner: winner || "Bilinmiyor",
              entrantsCount: activeGiveaway.entrants.length
            });
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
    
    // Trigger Webhook
    triggerWebhook("giveaway_start", {
      prize: newGiveaway.prize,
      description: lang === "TR" ? newGiveaway.descriptionTR : newGiveaway.descriptionEN
    });

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
          {(() => {
            if (!activeGiveaway) {
              return (
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
              );
            }

            const skin = getSkinDetails(activeGiveaway.prize);
            const myName = currentUser ? currentUser.name : (localStorage.getItem("weew_giveaway_anon_name") || nickname || "Gezgin");
            const myTickets = activeGiveaway.entrants.filter(n => n === myName).length;

            return (
              <div className="p-6 rounded-3xl border border-white/5 bg-[#12131a]/60 backdrop-blur-sm relative overflow-hidden space-y-6">
                
                {/* Glowing decorative ambient corner with skin rarity color */}
                <div 
                  className="absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl pointer-events-none transition-all duration-500 opacity-20"
                  style={{ backgroundColor: skin.color }}
                />

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/5 pb-5">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00e676]/10 px-3 py-1 border border-[#00e676]/20 text-[#00e676] text-[10px] font-mono font-black uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00e676] animate-pulse" />
                        {lang === "TR" ? "AKTİF KATILIM" : "ACTIVE RAFFLE"}
                      </div>
                      
                      {/* Interactive countdown clock */}
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-black uppercase tracking-wider">
                        <span className="animate-pulse">⏳</span>
                        {timeLeft}
                      </div>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                      {activeGiveaway.prize}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-2xl">
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

                {/* CS2 Premium Weapon Preview Card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-5 flex flex-col md:flex-row items-center gap-6">
                  {/* Absolute subtle background grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                  
                  {/* Gun silhouette / aesthetic geometric representation */}
                  <div 
                    className={`relative shrink-0 w-32 h-32 rounded-xl bg-gradient-to-br ${skin.bgGradient} border border-white/5 flex flex-col items-center justify-center p-3`}
                  >
                    <span className="text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">🔫</span>
                    <span 
                      className="absolute bottom-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-widest text-black"
                      style={{ backgroundColor: skin.color }}
                    >
                      {skin.rarity}
                    </span>
                  </div>

                  {/* Weapon attributes & Float slider bar */}
                  <div className="flex-1 w-full space-y-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-white font-mono uppercase tracking-wider">{skin.weapon}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs font-semibold text-gray-300">{skin.skin}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] font-mono">
                      <div>
                        <span className="text-gray-500 block uppercase font-bold text-[9px]">{lang === "TR" ? "DIŞ GÖRÜNÜŞ" : "EXTERIOR"}</span>
                        <span className="text-gray-200 font-medium">{lang === "TR" ? skin.wearTR : skin.wear}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase font-bold text-[9px]">{lang === "TR" ? "KALİTE GRUBU" : "GRADE"}</span>
                        <span className="font-bold uppercase" style={{ color: skin.color }}>{lang === "TR" ? skin.rarityTR : skin.rarity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase font-bold text-[9px]">FLOAT VALUE</span>
                        <span className="text-yellow-400 font-black">{skin.float}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase font-bold text-[9px]">{lang === "TR" ? "ÖZEL NİTELİK" : "ATTRIBUTES"}</span>
                        <span className="text-[#00e676] font-bold flex items-center gap-1">
                          <Star className="h-3 w-3 text-[#00e676] fill-[#00e676]" />
                          StatTrak™
                        </span>
                      </div>
                    </div>

                    {/* Highly tactile CS2 Float Spectrum Slider Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[8px] font-mono font-black text-gray-500">
                        <span>FN (0.00)</span>
                        <span>MW (0.07)</span>
                        <span>FT (0.15)</span>
                        <span>WW (0.38)</span>
                        <span>BS (0.45 - 1.0)</span>
                      </div>
                      <div className="relative h-2 w-full bg-gradient-to-r from-blue-500 via-green-400 to-red-600 rounded-full border border-white/5">
                        {/* Float point handle indicator indicator */}
                        <div 
                          className="absolute h-3 w-3 rounded-full bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,1)] -top-[2px] transition-all duration-1000"
                          style={{ left: `calc(${Math.min(parseFloat(skin.float) * 100, 100)}% - 6px)` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enter giveaway widget & Ticket Shop Hub */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden">
                  {hasJoined ? (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3 text-[#00e676]">
                          <CheckCircle2 className="h-6 w-6 shrink-0" />
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider">
                              {lang === "TR" ? "Çekiliş Katılımınız Doğrulandı!" : "Raffle Registration Verified!"}
                            </h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {lang === "TR" 
                                ? `${myName} olarak listeye kaydoldunuz.` 
                                : `Registered as ${myName}.`}
                            </p>
                          </div>
                        </div>

                        {/* Interactive wallet balance */}
                        <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono text-[10px] font-bold flex items-center gap-1.5">
                          <span>💎</span>
                          <span>{lang === "TR" ? "BAKİYENİZ:" : "BALANCE:"} {channelPoints} PUAN</span>
                        </div>
                      </div>

                      {/* Dynamic Ticket Hub section */}
                      <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <h5 className="font-display text-xs font-extrabold text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                              <Gift className="h-4 w-4" />
                              {lang === "TR" ? "🎫 BİLET MERKEZİ (ŞANS ARTTIRICI)" : "🎫 TICKET CENTER (WIN MULTIPLIER)"}
                            </h5>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {lang === "TR" 
                                ? `Kanal puanları ile daha fazla bilet alın, adınız kurada daha çok çıksın! (+%${myTickets * 100} Şans)` 
                                : `Buy additional tickets with channel points to multiply your odds! (+%${myTickets * 100} Chance)`}
                            </p>
                          </div>

                          <div className="font-mono text-xs font-black text-purple-400 bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                            {myTickets} / 5 bilet
                          </div>
                        </div>

                        {/* Visual Ticket progression check dots */}
                        <div className="flex gap-2.5 justify-center py-2">
                          {[1, 2, 3, 4, 5].map((num) => {
                            const active = num <= myTickets;
                            return (
                              <div 
                                key={num}
                                className={`h-10 w-12 rounded-lg border flex flex-col items-center justify-center font-mono font-black text-xs transition duration-300 ${
                                  active 
                                    ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] scale-105" 
                                    : "bg-black/40 border-white/5 text-gray-600"
                                }`}
                                title={active ? "Bilet Alındı!" : "Kilitli Bilet"}
                              >
                                <span className="text-[10px]">🎫</span>
                                <span className="text-[8px] mt-0.5">#{num}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Ticket purchase action button */}
                        {myTickets < 5 ? (
                          <button
                            type="button"
                            disabled={channelPoints < 15}
                            onClick={() => {
                              // Deduct points
                              const nextPoints = channelPoints - 15;
                              setChannelPoints(nextPoints);
                              localStorage.setItem(getPointsKey(), nextPoints.toString());

                              // Add entrant name again
                              const updated = giveaways.map(g => {
                                if (g.id === activeGiveaway.id) {
                                  return {
                                    ...g,
                                    entrants: [...g.entrants, myName]
                                  };
                                }
                                return g;
                              });
                              saveAndSetGiveaways(updated);

                              // Success notifications & custom point triggers
                              window.dispatchEvent(new CustomEvent("weew_points_update"));
                              
                              if (lang === "TR") {
                                alert(`🎫 Tebrikler! 15 Kanal Puanı karşılığında başarıyla ek çekiliş bileti aldınız! Toplam biletiniz: ${myTickets + 1}`);
                              } else {
                                alert(`🎫 Success! You bought an extra raffle ticket for 15 Channel Points! Total tickets: ${myTickets + 1}`);
                              }
                            }}
                            className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                              channelPoints >= 15
                                ? "bg-amber-400 hover:bg-amber-500 text-black shadow-lg shadow-amber-400/10"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                            }`}
                          >
                            <Gift className="h-4 w-4 shrink-0" />
                            {lang === "TR" 
                              ? `Ekstra 1 Bilet Satın Al (-15 Kanal Puanı)` 
                              : `Buy Extra 1 Ticket (-15 Channel Points)`}
                          </button>
                        ) : (
                          <div className="text-center text-[#00e676] font-bold text-[10px] uppercase py-1 border border-[#00e676]/20 bg-[#00e676]/5 rounded-xl">
                            ✅ {lang === "TR" ? "MAKSİMUM BİLET SINIRINA ULAŞTINIZ! ŞANSINIZ TAVAN YAPTI!" : "MAX TICKET LIMIT REACHED! WIN CHANCE OPTIMIZED!"}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleJoinGiveaway} className="space-y-4">
                      {/* Character Avatar Picker */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-purple-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {lang === "TR" ? "Yayın Odası Karakter Avatarını Seç" : "Select Your Room Character Avatar"}
                          </span>
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 custom-scrollbar scroll-smooth">
                          {AVATAR_PRESETS.map((preset) => {
                            const isSelected = selectedPresetAvatar === preset.url;
                            return (
                              <button
                                key={preset.url}
                                type="button"
                                onClick={() => setSelectedPresetAvatar(preset.url)}
                                className={`relative group shrink-0 h-14 w-14 rounded-xl border-2 transition duration-200 overflow-hidden cursor-pointer ${
                                  isSelected
                                    ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-105"
                                    : "border-white/5 hover:border-white/20 hover:scale-102"
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.label}
                                  className="h-full w-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[8px] text-white font-mono font-black uppercase text-center p-0.5">
                                  {preset.label}
                                </div>
                                {isSelected && (
                                  <div className="absolute top-1 right-1 bg-purple-500 rounded-full p-0.5">
                                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            required
                            disabled={!!currentUser}
                            placeholder={currentUser ? currentUser.name : (lang === "TR" ? "Sohbet Takma Adınızı Girin" : "Enter Chat Nickname")}
                            className="w-full h-11 rounded-xl bg-[#12131a] border border-white/5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition font-medium"
                          />
                        </div>
                        <button
                          type="submit"
                          className="h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider px-6 transition shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/15"
                        >
                          <Gift className="h-4 w-4" />
                          {lang === "TR" ? "Çekilişe Katıl" : "Join Raffle"}
                        </button>
                      </div>
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
                      {spinList.map((entrant, idx) => {
                        const avatarUrl = entrantAvatars[entrant] || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop";
                        return (
                          <div
                            key={idx}
                            className={`w-[130px] h-10 shrink-0 rounded-lg flex items-center gap-2 pl-1.5 pr-2 font-mono font-bold text-xs uppercase transition border ${
                              spinIndex === idx
                                ? "bg-purple-500/20 border-purple-500 text-white font-black"
                                : "bg-[#111218]/80 border-white/5 text-gray-500"
                            }`}
                          >
                            <img
                              src={avatarUrl}
                              alt=""
                              className="h-6 w-6 rounded-full border border-white/10 shrink-0 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="truncate">{entrant}</span>
                          </div>
                        );
                      })}
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

                      {/* Glowing Winner Avatar */}
                      <div className="relative mb-3">
                        <div className="absolute inset-0 rounded-full bg-[#00e676]/30 blur-md animate-pulse" />
                        <img
                          src={entrantAvatars[winnerName] || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"}
                          alt={winnerName}
                          className="h-16 w-16 rounded-full border-2 border-[#00e676] object-cover relative z-10 mx-auto shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-[#00e676] text-black rounded-full p-1 z-20">
                          <Trophy className="h-3 w-3" />
                        </div>
                      </div>

                      <h4 className="text-xs font-mono font-black text-[#00e676] uppercase tracking-wider">
                        {lang === "TR" ? "ÇEKİLİŞ SONUÇLANDI!" : "RAFFLE CONCLUDED!"}
                      </h4>
                      <h2 className="font-display text-2xl font-black text-white uppercase mt-1">
                        {winnerName}
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
                    {activeGiveaway.entrants.map((entrant, i) => {
                      const avatarUrl = entrantAvatars[entrant] || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop";
                      const isMe = entrant === currentUser?.name;
                      return (
                        <span 
                          key={i} 
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider border transition ${
                            isMe 
                              ? "bg-[#00e676]/10 border-[#00e676]/30 text-[#00e676]" 
                              : "bg-[#161720] border-white/5 text-gray-400"
                          }`}
                        >
                          <img
                            src={avatarUrl}
                            alt=""
                            className="h-4 w-4 rounded-full object-cover border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <span>{entrant}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}
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
