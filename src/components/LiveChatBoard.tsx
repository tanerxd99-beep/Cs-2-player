import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Trash2, Shield, Crown, Star, Gem, 
  Play, Pause, Settings, Smile, Volume2, HelpCircle, AlertCircle
} from "lucide-react";
import { TranslationDict } from "../types";
import { UserAccount } from "./AuthModal";

interface LiveChatBoardProps {
  translations: TranslationDict;
  isStreamLive: boolean;
  currentUser?: UserAccount | null;
  lang: "TR" | "EN";
}

const getAvatarGradient = (username: string) => {
  const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-[#a855f7] to-[#6366f1]", // purple-indigo
    "from-[#ec4899] to-[#f43f5e]", // pink-rose
    "from-[#3b82f6] to-[#06b6d4]", // blue-cyan
    "from-[#10b981] to-[#059669]", // emerald
    "from-[#f59e0b] to-[#ea580c]", // amber-orange
    "from-[#14b8a6] to-[#0d9488]", // teal
    "from-[#d946ef] to-[#c084fc]", // fuchsia-violet
    "from-[#6366f1] to-[#4338ca]"  // indigo
  ];
  return gradients[hash % gradients.length];
};

interface ChatMessage {
  id: string;
  user: string;
  role: "admin" | "moderator" | "vip" | "subscriber" | "user" | "system";
  text: string;
  timestamp: string;
  isUser?: boolean;
  isSystem?: boolean;
  adminBadgeColor?: string;
}

// Predefined mock profiles for simulated chatters
const MOCK_CHATTERS = [
  { name: "Xantares_Jr", role: "vip" as const },
  { name: "Woxic_Fan", role: "subscriber" as const },
  { name: "CS2_Delisi", role: "user" as const },
  { name: "HeaveN_CS", role: "moderator" as const },
  { name: "Lurker_01", role: "user" as const },
  { name: "ClutchGod", role: "vip" as const },
  { name: "Aim_Canavari", role: "subscriber" as const },
  { name: "Inan_Fan_99", role: "subscriber" as const },
  { name: "GamerGirl_TR", role: "vip" as const },
  { name: "SherlockCS", role: "user" as const },
  { name: "Lobi_Beyi", role: "subscriber" as const },
  { name: "CrosshairMaster", role: "user" as const },
  { name: "Unstoppable", role: "subscriber" as const },
  { name: "EcoRoundHero", role: "user" as const },
  { name: "FlashbangEnjoyer", role: "moderator" as const },
];

const MOCK_MESSAGES_TR = [
  "selamın aleyküm beyler, iyi yayınlar!",
  "abi dün geceki CS maçı efsaneydi ya",
  "clutch pozisyonunda yüreğim ağzıma geldi valla",
  "İnan abi crosshair kodunu aldım, direkt kafadan vuruyorum artık 🎯",
  "Faceit seviyesi kaç abi şu an?",
  "drop var mı yayında? 👀",
  "klavye modeli neydi abi?",
  "abi hassasiyet (sens) kaçta oynuyorsun?",
  "oyun canavarı yaaa 🔥",
  "yayının kalitesi muazzam, 1080p60fps akıyor",
  "hahahah o nasıl vuruştu öyle 😂",
  "o7 selamlar şef",
  "adam geldi adam 👑",
  "yayına yeni geldim selam herkese",
  "GG WP!",
  "turnuva ne zaman olacak abi?",
  "kral yayındayızzz",
  "bu harita Dust 2 mi yoksa Mirage mi?",
  "İnan abi yine formunda bugün 💪",
  "MOD abiler bana bi VIP salar mısınız be :D",
  "sublara özel çekiliş var mı?",
  "KICK kalitesi harbi başka",
  "Awp vuruşu feciydi yalnız!",
  "abi yeni kulaklıktan memnun musun?",
  "hahaha koptum ya",
];

const MOCK_MESSAGES_EN = [
  "hello everyone, have a nice stream! 👋",
  "that last round was insane omg!",
  "wp bro, very clean gameplay",
  "what is your current rank in Faceit?",
  "is there any active giveaway right now?",
  "copied the crosshair settings, it's so good! 🎯",
  "crisp clean locks boys!",
  "which mouse are you using right now?",
  "haha that was hilarious! 😂",
  "stream quality is absolute fire 🔥",
  "o7 respect!",
  "GG WP!",
  "just joined, happy to be here!",
  "how long have you been streaming on Kick?",
  "insane flickshot, wow",
  "can we join the lobby next game? please",
  "love from Germany! 🇩🇪",
  "the settings section on this site is so cool",
  "KICK stream is lag-free today, loving it",
  "Are you doing view games today?",
  "Admin please clear the chat lol",
  "Inan is standard beast mode today",
];

const censorText = (text: string, blacklist: string[]): string => {
  if (!text) return text;
  let censored = text;
  
  // Sort blacklist by length descending to make sure longer phrases are censored first
  const sortedBlacklist = [...blacklist].sort((a, b) => b.length - a.length);

  for (const word of sortedBlacklist) {
    if (!word || word.trim() === "") continue;
    const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedWord, "gi");
    censored = censored.replace(regex, (match) => "*".repeat(match.length));
  }
  return censored;
};

export default function LiveChatBoard({
  translations,
  isStreamLive,
  currentUser,
  lang,
}: LiveChatBoardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isChatPaused, setIsChatPaused] = useState<boolean>(() => {
    return localStorage.getItem("weew_chat_paused") === "true";
  });
  const [slowMode, setSlowMode] = useState<boolean>(() => {
    return localStorage.getItem("weew_chat_slow_mode") === "true";
  });
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem("weew_chat_audio") !== "false";
  });

  const [censoredWords, setCensoredWords] = useState<string[]>(() => {
    const saved = localStorage.getItem("weew_censored_words");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      "amk", "aq", "sik", "göt", "piç", "yarrak", "orospu", "oç", "meme", "daşşak", "kahpe", "siktir", "yavşak", "amına", "götlek", "pipi", "orospu çocuğu", "şerefsiz", "piz"
    ];
  });

  // Custom guest identity
  const [guestNickname, setGuestNickname] = useState<string>(() => {
    const saved = localStorage.getItem("weew_kick_guest_nick");
    if (saved) return saved;
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `Gezgin#${randNum}`;
  });

  const [showNickSettings, setShowNickSettings] = useState(false);
  const [tempNick, setTempNick] = useState(guestNickname);
  
  // Pinned message state
  const [pinnedMessage, setPinnedMessage] = useState<string | null>(() => {
    return localStorage.getItem("weew_chat_pinned") || 
      (lang === "TR" 
        ? "📌 İnan'ı Kick kanalından takip etmeyi ve yayın bildirimlerini açmayı unutmayın! 💚" 
        : "📌 Don't forget to follow Inan on Kick and enable stream notifications! 💚");
  });
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [tempPin, setTempPin] = useState("");
  const [isPinnedDismissed, setIsPinnedDismissed] = useState(false);

  // Emote selection popup state
  const [showEmotePicker, setShowEmotePicker] = useState(false);

  // Dynamic active chat role for testing/customization
  const [testRole, setTestRole] = useState<"admin" | "moderator" | "vip" | "subscriber" | "user">(() => {
    const saved = localStorage.getItem("weew_chat_test_role");
    if (saved && (saved !== "admin" || currentUser?.role === "admin")) return saved as any;
    return currentUser?.role === "admin" ? "admin" : "user";
  });

  // Admin badge color customization
  const [adminBadgeColor, setAdminBadgeColor] = useState<string>(() => {
    return localStorage.getItem("weew_admin_badge_color") || "red";
  });

  // Dynamic Points and Roles Storage Keys
  const getPointsKey = () => {
    if (currentUser && currentUser.email) {
      return `weew_channel_points_${currentUser.email}`;
    }
    return `weew_channel_points_guest_${guestNickname}`;
  };

  const getUnlockedRolesKey = () => {
    if (currentUser && currentUser.email) {
      return `weew_unlocked_roles_${currentUser.email}`;
    }
    return `weew_unlocked_roles_guest_${guestNickname}`;
  };

  // Channel Points System (Dynamically scoped per user/guest)
  const [channelPoints, setChannelPoints] = useState<number>(() => {
    const key = currentUser && currentUser.email
      ? `weew_channel_points_${currentUser.email}`
      : `weew_channel_points_guest_${guestNickname}`;
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : 50;
  });

  // Unlocked Roles List (Dynamically scoped per user/guest)
  const [unlockedRoles, setUnlockedRoles] = useState<("user" | "subscriber" | "vip" | "moderator" | "admin")[]>(() => {
    const key = currentUser && currentUser.email
      ? `weew_unlocked_roles_${currentUser.email}`
      : `weew_unlocked_roles_guest_${guestNickname}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const mapped = parsed as any[];
          if (!mapped.includes("user")) mapped.push("user");
          return mapped;
        }
      } catch (e) {
        // ignore
      }
    }
    const defaults: ("user" | "subscriber" | "vip" | "moderator" | "admin")[] = ["user"];
    if (currentUser?.role === "admin") {
      defaults.push("admin", "moderator", "vip", "subscriber");
    }
    return defaults;
  });

  const [showPointsGain, setShowPointsGain] = useState<number | null>(null);

  const saveUnlockedRoles = (roles: ("user" | "subscriber" | "vip" | "moderator" | "admin")[]) => {
    setUnlockedRoles(roles);
    const key = getUnlockedRolesKey();
    localStorage.setItem(key, JSON.stringify(roles));
  };

  const addChannelPoints = (pts: number) => {
    setChannelPoints((prev) => {
      const next = prev + pts;
      const key = getPointsKey();
      localStorage.setItem(key, next.toString());
      return next;
    });
    
    setShowPointsGain(pts);
    setTimeout(() => {
      setShowPointsGain(null);
    }, 1500);
  };

  // Quest states for role unlocks
  const [questTargetRole, setQuestTargetRole] = useState<"subscriber" | "vip" | "moderator" | null>(null);
  const [modPasswordInput, setModPasswordInput] = useState("");
  const [modError, setModError] = useState("");
  const [triviaQuestionIndex, setTriviaQuestionIndex] = useState(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaAnswerResult, setTriviaAnswerResult] = useState<"correct" | "incorrect" | null>(null);

  const VIP_TRIVIA_QUESTIONS = [
    {
      qTR: "CS2 oyununda C4 bombasını imha kiti (defuse kit) olmadan çözmek tam kaç saniye sürer?",
      qEN: "How many seconds does it take to defuse a C4 bomb without a defuse kit in CS2?",
      options: ["5 saniye", "10 saniye", "15 saniye", "40 saniye"],
      optionsEN: ["5 seconds", "10 seconds", "15 seconds", "40 seconds"],
      correctIndex: 1, // 10 seconds
    },
    {
      qTR: "Aşağıdaki silahlardan hangisi CS2 oyununda sadece Terörist (T) tarafına özeldir?",
      qEN: "Which of the following weapons is exclusive to the Terrorist (T) side in CS2?",
      options: ["M4A4", "Galil AR", "Famas", "AUG"],
      optionsEN: ["M4A4", "Galil AR", "Famas", "AUG"],
      correctIndex: 1, // Galil AR
    },
    {
      qTR: "Faceit platformundaki en yüksek rekabetçi seviye (Level) kaçtır?",
      qEN: "What is the highest competitive level on the Faceit platform?",
      options: ["Level 3", "Level 10", "Level 15", "Level 20"],
      optionsEN: ["Level 3", "Level 10", "Level 15", "Level 20"],
      correctIndex: 1, // Level 10
    },
    {
      qTR: "CS2 rekabetçi modunda harita başına maksimum normal devre raundu (MR12 öncesi hariç) kaçtır?",
      qEN: "In CS2 competitive match regulation, how many rounds are in a standard half?",
      options: ["12 raund", "15 raund", "24 raund", "30 raund"],
      optionsEN: ["12 rounds", "15 rounds", "24 rounds", "30 rounds"],
      correctIndex: 0, // 12 rounds
    }
  ];

  const [lastSentTimestamp, setLastSentTimestamp] = useState(0);
  const [slowCountdown, setSlowCountdown] = useState(0);
  
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Floating reactions/likes simulation
  const [reactions, setReactions] = useState<{ id: number; char: string; left: number }[]>([]);
  const reactionIdCounter = useRef(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sound generator synth
  const playPopSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch (e) {
      // Audio autoplay restrictions
    }
  };

  // Synchronize state when current user or guest nickname changes
  useEffect(() => {
    // Sync points
    const pointsKey = currentUser && currentUser.email
      ? `weew_channel_points_${currentUser.email}`
      : `weew_channel_points_guest_${guestNickname}`;
    const savedPoints = localStorage.getItem(pointsKey);
    setChannelPoints(savedPoints ? parseInt(savedPoints, 10) : 50);

    // Sync roles
    const rolesKey = currentUser && currentUser.email
      ? `weew_unlocked_roles_${currentUser.email}`
      : `weew_unlocked_roles_guest_${guestNickname}`;
    const savedRoles = localStorage.getItem(rolesKey);
    if (savedRoles) {
      try {
        const parsed = JSON.parse(savedRoles);
        if (Array.isArray(parsed)) {
          const mapped = parsed as any[];
          if (!mapped.includes("user")) mapped.push("user");
          setUnlockedRoles(mapped);
        } else {
          setUnlockedRoles(currentUser?.role === "admin" ? ["user", "admin", "moderator", "vip", "subscriber"] : ["user"]);
        }
      } catch (e) {
        setUnlockedRoles(currentUser?.role === "admin" ? ["user", "admin", "moderator", "vip", "subscriber"] : ["user"]);
      }
    } else {
      setUnlockedRoles(currentUser?.role === "admin" ? ["user", "admin", "moderator", "vip", "subscriber"] : ["user"]);
    }

    setTempNick(guestNickname);
  }, [currentUser?.email, guestNickname]);

  // Passive Channel Points Earning when stream is live
  useEffect(() => {
    if (!isStreamLive) return;
    const interval = setInterval(() => {
      const passivePts = parseInt(localStorage.getItem("weew_points_passive") || "10", 10);
      addChannelPoints(passivePts);
    }, 20000); // every 20 seconds
    return () => clearInterval(interval);
  }, [isStreamLive]);

  // Synchronize state with localStorage dynamically when Admin Panel or other parts change them
  useEffect(() => {
    const handleStorageChange = () => {
      // Sync unlocked roles
      const rolesKey = currentUser && currentUser.email
        ? `weew_unlocked_roles_${currentUser.email}`
        : `weew_unlocked_roles_guest_${guestNickname}`;
      const savedRoles = localStorage.getItem(rolesKey) || localStorage.getItem("weew_unlocked_roles");
      if (savedRoles) {
        try {
          const parsed = JSON.parse(savedRoles);
          if (Array.isArray(parsed)) {
            setUnlockedRoles(parsed);
          }
        } catch (e) {
          // ignore
        }
      }
      
      // Sync active test role
      const savedTestRole = localStorage.getItem("weew_chat_test_role");
      if (savedTestRole) {
        setTestRole(savedTestRole as any);
      }

      // Sync censored words
      const savedCensored = localStorage.getItem("weew_censored_words");
      if (savedCensored) {
        try {
          const parsed = JSON.parse(savedCensored);
          if (Array.isArray(parsed)) {
            setCensoredWords(parsed);
          }
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUser?.email, guestNickname]);

  // Seed initial clean messages on mount
  useEffect(() => {
    const initialMsgs: ChatMessage[] = [];
    
    // Welcome message
    initialMsgs.push({
      id: `welcome-system-${Date.now()}`,
      user: lang === "TR" ? "YAYIN SİSTEMİ" : "STREAM SYSTEM",
      role: "system",
      text: lang === "TR" 
        ? "🤖 Gerçekçi Canlı Sohbet Arayüzüne Hoş Geldiniz! Kendiniz yazıp test edebilirsiniz."
        : "🤖 Welcome to the Realistic Live Chat Interface! You can type and test your own messages.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: true
    });

    // Command guidelines bot message
    initialMsgs.push({
      id: `welcome-bot-${Date.now() + 1}`,
      user: "KickBot",
      role: "moderator",
      text: lang === "TR" 
        ? "🎯 İnteraktif komutları denemek için sohbete !help yazın! (Diğer komutlar: !kick, !specs, !sens, !crosshair, !social)"
        : "🎯 Type !help in chat to try interactive bot commands! (Other commands: !kick, !specs, !sens, !crosshair, !social)",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    setMessages(initialMsgs);
  }, [lang]);

  // Handle scrolling behavior
  useEffect(() => {
    if (isAutoScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isAutoScroll]);

  // Slow mode timer check
  useEffect(() => {
    if (slowCountdown <= 0) return;
    const timer = setTimeout(() => {
      setSlowCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [slowCountdown]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    
    // If user has scrolled up by more than 80px, disable autoscroll
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;
    setIsAutoScroll(isAtBottom);
  };

  const handleToggleSlowMode = (enabled: boolean) => {
    setSlowMode(enabled);
    localStorage.setItem("weew_chat_slow_mode", enabled ? "true" : "false");
    
    // Auto-inject a highly visible system notification message in chat
    const now = new Date();
    const sysMsg: ChatMessage = {
      id: `system-slowmode-${Date.now()}-${Math.random()}`,
      user: lang === "TR" ? "SİSTEM" : "SYSTEM",
      role: "system",
      text: enabled
        ? (lang === "TR"
            ? "⚠️ Yavaş mod (3 saniye) yönetici tarafından açıldı. Lütfen sakin yazın!"
            : "⚠️ Slow Mode (3 seconds) has been enabled by the administrator. Please chat slowly!")
        : (lang === "TR"
            ? "✅ Yavaş mod yönetici tarafından kapatıldı. Özgürce yazabilirsiniz!"
            : "✅ Slow Mode has been disabled by the administrator. Feel free to chat!"),
      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: true
    };

    setMessages((prev) => [...prev.slice(-79), sysMsg]);
    setIsAutoScroll(true);
    
    if (audioEnabled) {
      playPopSound();
    }
  };

  const handleToggleChatPaused = (paused: boolean) => {
    setIsChatPaused(paused);
    localStorage.setItem("weew_chat_paused", paused ? "true" : "false");
    
    // Auto-inject a system notification message in chat
    const now = new Date();
    const sysMsg: ChatMessage = {
      id: `system-pause-${Date.now()}-${Math.random()}`,
      user: lang === "TR" ? "SİSTEM" : "SYSTEM",
      role: "system",
      text: paused
        ? (lang === "TR"
            ? "⏸️ Canlı sohbet akışı yönetici tarafından duraklatıldı."
            : "⏸️ Live chat stream has been paused by the administrator.")
        : (lang === "TR"
            ? "▶️ Canlı sohbet akışı yönetici tarafından başlatıldı."
            : "▶️ Live chat stream has been resumed by the administrator."),
      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: true
    };

    setMessages((prev) => [...prev.slice(-79), sysMsg]);
    setIsAutoScroll(true);

    if (audioEnabled) {
      playPopSound();
    }
  };

  const checkForCommands = (text: string) => {
    const trimmed = text.trim().toLowerCase();
    if (!trimmed.startsWith("!")) return;

    const cmd = trimmed.split(" ")[0];
    let replyText = "";

    switch (cmd) {
      case "!help":
        replyText = lang === "TR"
          ? "🤖 Kullanılabilir komutlar: !kick, !specs, !sens, !crosshair, !social - sohbeti canlandırın!"
          : "🤖 Available commands: !kick, !specs, !sens, !crosshair, !social - fire up the chat!";
        break;
      case "!kick":
        replyText = lang === "TR"
          ? "💚 İnan'ın resmi Kick kanalı: https://kick.com/inan - Desteklemek için takip etmeyi unutmayın!"
          : "💚 Inan's official Kick channel: https://kick.com/inan - Follow and support!";
        break;
      case "!specs":
        replyText = lang === "TR"
          ? "💻 Sistem Özellikleri: AMD Ryzen 7 7800X3D, NVIDIA RTX 4070 Ti, 32 GB DDR5 RAM, 1 TB NVMe SSD."
          : "💻 System Specs: AMD Ryzen 7 7800X3D, NVIDIA RTX 4070 Ti, 32 GB DDR5 RAM, 1 TB NVMe SSD.";
        break;
      case "!sens":
        replyText = lang === "TR"
          ? "🎯 Hassasiyet Ayarı: DPI: 800, Oyun İçi: 1.10. Çözünürlük: 1280x960 (4:3 stretched)."
          : "🎯 Sensitivity: DPI: 800, In-game: 1.10. Resolution: 1280x960 (4:3 stretched).";
        break;
      case "!crosshair":
        replyText = lang === "TR"
          ? "🎯 CS2 Crosshair Kodu: CSGO-7yH6o-mUenO-pL98k-zX7zN-98D7M. Konsolda cl_crosshair... komutlarıyla da kurabilirsiniz."
          : "🎯 CS2 Crosshair Code: CSGO-7yH6o-mUenO-pL98k-zX7zN-98D7M. Paste cl_crosshair... into console.";
        break;
      case "!social":
        replyText = lang === "TR"
          ? "📱 Sosyal Medya Hesapları: Instagram: @inancs2, YouTube: İnan. Topluluk için takipte kalın!"
          : "📱 Social Media: Instagram: @inancs2, YouTube: İnan. Stay tuned for updates!";
        break;
      default:
        return; // ignore unknown commands
    }

    // Bot responds in 800ms
    setTimeout(() => {
      const now = new Date();
      const botMsg: ChatMessage = {
        id: `bot-cmd-${Date.now()}-${Math.random()}`,
        user: "KickBot",
        role: "moderator",
        text: replyText,
        timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: false
      };
      setMessages((prev) => [...prev.slice(-79), botMsg]);
      setIsAutoScroll(true);
      if (audioEnabled) {
        playPopSound();
      }
    }, 800);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    // Check slow mode (Admin / Moderator / TestAdmin bypasses)
    const isAdmin = currentUser?.role === "admin" || testRole === "admin";
    if (slowMode && slowCountdown > 0 && !isAdmin) {
      return;
    }

    const now = new Date();
    
    // Check and trigger slow mode cooldown (if not admin)
    if (slowMode && !isAdmin) {
      setSlowCountdown(3);
    }

    let senderName = guestNickname;
    let senderRole: ChatMessage["role"] = testRole;

    if (currentUser) {
      senderName = currentUser.name;
    }

    const messageContent = inputText.trim();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      user: senderName,
      role: senderRole,
      text: messageContent,
      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      ...(senderRole === "admin" ? { adminBadgeColor } : {})
    };

    setMessages((prev) => [...prev.slice(-79), userMsg]);
    setInputText("");
    setIsAutoScroll(true);
    setLastSentTimestamp(Date.now());
    const activePts = parseInt(localStorage.getItem("weew_points_per_msg") || "15", 10);
    addChannelPoints(activePts);

    if (audioEnabled) {
      playPopSound();
    }

    // Trigger command simulation checks
    checkForCommands(messageContent);
  };

  // Quick reaction button triggered by user
  const sendReaction = (emoji: string) => {
    const id = reactionIdCounter.current++;
    const left = 15 + Math.random() * 70; // randomize floating path horizontally
    setReactions((prev) => [...prev, { id, char: emoji, left }]);

    // auto clean reaction after 2s
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);

    // Also write it directly into chat input
    setInputText((prev) => {
      const space = prev ? " " : "";
      return `${prev}${space}${emoji}`;
    });

    if (audioEnabled) {
      playPopSound();
    }
  };

  // Quick Direct Emote sender
  const sendDirectEmote = (emoji: string) => {
    const isAdmin = currentUser?.role === "admin" || testRole === "admin";
    if (slowMode && slowCountdown > 0 && !isAdmin) return;
    
    const now = new Date();
    if (slowMode && !isAdmin) {
      setSlowCountdown(3);
    }

    let senderName = guestNickname;
    let senderRole: ChatMessage["role"] = testRole;

    if (currentUser) {
      senderName = currentUser.name;
    }

    const emoteMsg: ChatMessage = {
      id: `user-emote-${Date.now()}-${Math.random()}`,
      user: senderName,
      role: senderRole,
      text: emoji,
      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      ...(senderRole === "admin" ? { adminBadgeColor } : {})
    };

    setMessages((prev) => [...prev.slice(-79), emoteMsg]);
    setIsAutoScroll(true);

    if (audioEnabled) {
      playPopSound();
    }
  };

  // Pinned message save handler
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPin.trim()) {
      const sanitized = tempPin.trim();
      setPinnedMessage(sanitized);
      localStorage.setItem("weew_chat_pinned", sanitized);
      setIsEditingPin(false);
    }
  };

  // Guest name update handler
  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempNick.trim() && tempNick.length >= 3 && tempNick.length <= 15) {
      const sanitized = tempNick.trim();
      setGuestNickname(sanitized);
      localStorage.setItem("weew_kick_guest_nick", sanitized);
      setShowNickSettings(false);
    }
  };

  // Moderation actions (only for Admin)
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  // Render role badges
  const renderBadge = (role: ChatMessage["role"], msg?: ChatMessage) => {
    switch (role) {
      case "system":
        return (
          <span className="inline-flex items-center gap-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none shrink-0 border border-amber-500/30 animate-pulse">
            <AlertCircle className="h-2.5 w-2.5 text-amber-400" />
            {lang === "TR" ? "SİSTEM" : "SYSTEM"}
          </span>
        );
      case "admin": {
        const badgeColor = msg?.adminBadgeColor || adminBadgeColor;
        let colorClasses = "bg-red-500/20 text-red-400 border-red-500/30";
        if (badgeColor === "blue") colorClasses = "bg-blue-500/20 text-blue-400 border-blue-500/30";
        else if (badgeColor === "green") colorClasses = "bg-green-500/20 text-green-400 border-green-500/30";
        else if (badgeColor === "purple") colorClasses = "bg-purple-500/20 text-purple-400 border-purple-500/30";
        else if (badgeColor === "pink") colorClasses = "bg-pink-500/20 text-pink-400 border-pink-500/30";
        else if (badgeColor === "amber") colorClasses = "bg-amber-500/20 text-amber-400 border-amber-500/30";
        else if (badgeColor === "cyan") colorClasses = "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
        else if (badgeColor === "emerald") colorClasses = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

        return (
          <span className={`inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none shrink-0 border ${colorClasses}`}>
            <Crown className="h-2.5 w-2.5 shrink-0" />
            {lang === "TR" ? "YÖNETİCİ" : "ADMIN"}
          </span>
        );
      }
      case "moderator":
        return (
          <span className="inline-flex items-center gap-0.5 bg-green-500/20 text-green-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none shrink-0 border border-green-500/30">
            <Shield className="h-2.5 w-2.5 text-green-400 fill-green-400" />
            MOD
          </span>
        );
      case "vip":
        return (
          <span className="inline-flex items-center gap-0.5 bg-amber-400/20 text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none shrink-0 border border-amber-400/30">
            <Gem className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
            VIP
          </span>
        );
      case "subscriber":
        return (
          <span className="inline-flex items-center gap-0.5 bg-purple-500/20 text-purple-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none shrink-0 border border-purple-500/30">
            <Star className="h-2.5 w-2.5 text-purple-300 fill-purple-300" />
            SUB
          </span>
        );
      default:
        return null;
    }
  };

  // Colors based on roles
  const getNameColorClass = (role: ChatMessage["role"]) => {
    switch (role) {
      case "system": return "text-amber-400 font-extrabold";
      case "admin": return "text-red-400 hover:text-red-300";
      case "moderator": return "text-[#00e676] hover:text-emerald-400";
      case "vip": return "text-amber-400 hover:text-amber-300";
      case "subscriber": return "text-purple-400 hover:text-purple-300";
      default: return "text-blue-300 hover:text-blue-200";
    }
  };

  const QUICK_EMOTES = ["🔥", "😂", "👑", "😮", "🎯", "GG", "⚔️", "👍", "❤️"];

  return (
    <div className="w-full flex flex-col rounded-3xl border border-white/5 bg-[#0e0f17] overflow-hidden shadow-2xl h-[520px] lg:h-[630px] relative">
      
      {/* Floating emojis layer */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {reactions.map((react) => (
          <div
            key={react.id}
            className="absolute bottom-24 text-2xl animate-float-up"
            style={{ 
              left: `${react.left}%`,
            }}
          >
            {react.char}
          </div>
        ))}
      </div>

      {/* Role Unlocking & Quest Overlay */}
      {questTargetRole && (
        <div className="absolute inset-x-3.5 top-16 bottom-32 bg-[#090a0f]/98 backdrop-blur-xl border border-white/[0.08] rounded-2xl z-40 p-5 flex flex-col justify-between shadow-[0_15px_50px_-15px_rgba(0,0,0,0.8)] animate-fade-in text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#00e676]">
              {questTargetRole === "subscriber" && <Star className="h-4 w-4 fill-[#00e676] text-[#00e676]" />}
              {questTargetRole === "vip" && <Gem className="h-4 w-4 fill-[#00e676] text-[#00e676]" />}
              {questTargetRole === "moderator" && <Shield className="h-4 w-4 fill-[#00e676] text-[#00e676]" />}
              {lang === "TR" 
                ? `${questTargetRole === "subscriber" ? "ABONE" : questTargetRole.toUpperCase()} ROLÜ KİLİDİNİ AÇ` 
                : `UNLOCK ${questTargetRole.toUpperCase()} ROLE`}
            </h4>
            <button
              onClick={() => setQuestTargetRole(null)}
              className="text-gray-400 hover:text-white transition text-xs font-black p-1 hover:bg-white/5 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Quest Content */}
          <div className="flex-1 overflow-y-auto pr-1 py-4 text-xs space-y-3.5">
            {questTargetRole === "subscriber" && (
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  {lang === "TR"
                    ? "İnan'ın kanalına ücretsiz simüle olarak abone olarak anında SUB rozetine sahip olabilirsiniz! Ayrıca özel mor bir isme kavuşacaksınız."
                    : "Subscribe to Inan's channel for free in this simulation to get your SUB badge and a beautiful purple username!"}
                </p>
                <div className="bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-xl flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <h5 className="font-bold text-purple-300 text-[11px] uppercase">
                      {lang === "TR" ? "Abonelik Görevi" : "Subscription Quest"}
                    </h5>
                    <p className="text-[10px] text-gray-400">
                      {lang === "TR" ? "Aşağıdaki butona tıkla ve kanalı destekle!" : "Click the button below and support the channel!"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextRoles = [...unlockedRoles];
                    if (!nextRoles.includes("subscriber")) {
                      nextRoles.push("subscriber");
                    }
                    saveUnlockedRoles(nextRoles);
                    setTestRole("subscriber");
                    localStorage.setItem("weew_chat_test_role", "subscriber");

                    const now = new Date();
                    const subMsg: ChatMessage = {
                      id: `sub-alert-${Date.now()}-${Math.random()}`,
                      user: "KickAlert",
                      role: "system",
                      text: lang === "TR"
                        ? `🎉 TEBRİKLER! ${guestNickname || (currentUser ? currentUser.name : "Bir gezgin")} kanala ABONE OLDU! Desteğin için çok teşekkürler! 💚`
                        : `🎉 CONGRATULATIONS! ${guestNickname || (currentUser ? currentUser.name : "A guest")} just SUBSCRIBED to the channel! Thank you so much! 💚`,
                      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      isSystem: true
                    };
                    setMessages((prev) => [...prev.slice(-79), subMsg]);
                    setQuestTargetRole(null);
                    if (audioEnabled) {
                      playPopSound();
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-[#6366f1] hover:from-purple-500 hover:to-[#5558e6] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-98 cursor-pointer"
                >
                  {lang === "TR" ? "Abone Ol (Ücretsiz)" : "Subscribe (Free)"}
                </button>
              </div>
            )}

            {questTargetRole === "vip" && (
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  {lang === "TR"
                    ? "VIP statüsü almak için 100 Kanal Puanı (Kanalda durarak veya mesaj yazarak birikir) kullanabilir ya da CS2 Bilgi Yarışması sorusunu doğru yanıtlayabilirsin!"
                    : "To gain VIP status, you can spend 100 Channel Points (earned by staying in chat or writing messages) or correctly answer a CS2 trivia question!"}
                </p>

                {/* Point Option */}
                <div className="bg-amber-400/5 border border-amber-400/20 p-3 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <div>
                      <h5 className="font-bold text-amber-300 text-[10px] uppercase">
                        {lang === "TR" ? "100 KANAL PUANI" : "100 CHANNEL POINTS"}
                      </h5>
                      <p className="text-[9px] text-gray-400">
                        {lang === "TR" ? `Mevcut bakiyen: ${channelPoints} Puan` : `Your balance: ${channelPoints} Points`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={channelPoints < 100}
                    onClick={() => {
                      setChannelPoints((prev) => {
                        const next = prev - 100;
                        const key = getPointsKey();
                        localStorage.setItem(key, next.toString());
                        return next;
                      });

                      const nextRoles = [...unlockedRoles];
                      if (!nextRoles.includes("vip")) {
                        nextRoles.push("vip");
                      }
                      saveUnlockedRoles(nextRoles);
                      setTestRole("vip");
                      localStorage.setItem("weew_chat_test_role", "vip");

                      const now = new Date();
                      const vipMsg: ChatMessage = {
                        id: `vip-alert-${Date.now()}-${Math.random()}`,
                        user: "KickAlert",
                        role: "system",
                        text: lang === "TR"
                          ? `👑 TEBRİKLER! ${guestNickname || (currentUser ? currentUser.name : "Gezgin")} 100 Kanal Puanı harcayarak VIP rozetini aldı! Çekil kenara lordum!`
                          : `👑 CONGRATULATIONS! ${guestNickname || (currentUser ? currentUser.name : "Guest")} spent 100 Channel Points to claim VIP status! Welcome!`,
                        timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        isSystem: true
                      };
                      setMessages((prev) => [...prev.slice(-79), vipMsg]);
                      setQuestTargetRole(null);
                      if (audioEnabled) {
                        playPopSound();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                      channelPoints >= 100
                        ? "bg-amber-400 hover:bg-amber-500 text-black shadow-md"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                    }`}
                  >
                    {lang === "TR" ? "Kuponu Harca" : "Spend Points"}
                  </button>
                </div>

                {/* Trivia Option */}
                <div className="bg-blue-500/5 border border-blue-500/15 p-3 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                    <span className="text-xs">🎮</span>
                    <h5 className="font-bold text-blue-400 text-[10px] uppercase">
                      {lang === "TR" ? "CS2 Bilgi Testi Görevi" : "CS2 Trivia Challenge"}
                    </h5>
                  </div>
                  <p className="text-gray-200 text-[11px] font-semibold leading-normal">
                    {lang === "TR" 
                      ? VIP_TRIVIA_QUESTIONS[triviaQuestionIndex].qTR 
                      : VIP_TRIVIA_QUESTIONS[triviaQuestionIndex].qEN}
                  </p>
                  
                  {triviaAnswerResult === null ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {VIP_TRIVIA_QUESTIONS[triviaQuestionIndex].options.map((opt, idx) => {
                        const displayOption = lang === "TR" 
                          ? VIP_TRIVIA_QUESTIONS[triviaQuestionIndex].options[idx]
                          : VIP_TRIVIA_QUESTIONS[triviaQuestionIndex].optionsEN[idx];
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedTriviaOption(idx);
                              const isCorrect = idx === VIP_TRIVIA_QUESTIONS[triviaQuestionIndex].correctIndex;
                              if (isCorrect) {
                                setTriviaAnswerResult("correct");
                                const nextRoles = [...unlockedRoles];
                                if (!nextRoles.includes("vip")) {
                                  nextRoles.push("vip");
                                }
                                saveUnlockedRoles(nextRoles);
                                setTestRole("vip");
                                localStorage.setItem("weew_chat_test_role", "vip");

                                const now = new Date();
                                const vipMsg: ChatMessage = {
                                  id: `vip-alert-${Date.now()}-${Math.random()}`,
                                  user: "CS2Trivia",
                                  role: "system",
                                  text: lang === "TR"
                                    ? `🎯 TEBRİKLER! ${guestNickname || (currentUser ? currentUser.name : "Gezgin")} CS2 sorusunu doğru bilerek VIP ünvanını kazandı! 🎉`
                                    : `🎯 CONGRATULATIONS! ${guestNickname || (currentUser ? currentUser.name : "Guest")} answered the CS2 trivia correctly and won VIP! 🎉`,
                                  timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                  isSystem: true
                                };
                                setMessages((prev) => [...prev.slice(-79), vipMsg]);
                                setTimeout(() => setQuestTargetRole(null), 1500);
                              } else {
                                setTriviaAnswerResult("incorrect");
                              }
                              if (audioEnabled) {
                                playPopSound();
                              }
                            }}
                            className="bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/10 p-2 rounded-lg text-[10px] text-left transition text-gray-300 hover:text-white cursor-pointer"
                          >
                            {displayOption}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="pt-1 text-center">
                      {triviaAnswerResult === "correct" ? (
                        <p className="text-green-400 font-bold text-[11px] animate-bounce">
                          {lang === "TR" ? "🎉 DOĞRU! VIP Kilidi Açıldı!" : "🎉 CORRECT! VIP Unlocked!"}
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-red-400 font-bold text-[10px]">
                            {lang === "TR" ? "❌ Yanlış Cevap! Tekrar deneyebilirsin." : "❌ Wrong Answer! You can try again."}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setTriviaAnswerResult(null);
                              setSelectedTriviaOption(null);
                              setTriviaQuestionIndex((prev) => (prev + 1) % VIP_TRIVIA_QUESTIONS.length);
                            }}
                            className="text-[9px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 text-blue-400 underline cursor-pointer"
                          >
                            {lang === "TR" ? "Başka Soru Dene" : "Try Another Question"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {questTargetRole === "moderator" && (
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  {lang === "TR"
                    ? "Moderasyon ekibine dahil olmak için yayının moderatörlerinden gizli şifreyi almanız gerekiyor. Diğer modların hepsi bu şifreyi biliyor!"
                    : "To join the moderation team, you need to acquire the secret password from active moderators!"}
                </p>
                <div className="bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl">
                  <h5 className="font-bold text-green-300 text-[10px] uppercase mb-1.5">
                    {lang === "TR" ? "MODERATÖR ŞİFRESİ" : "MODERATOR PASSWORD"}
                  </h5>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={modPasswordInput}
                      onChange={(e) => {
                        setModPasswordInput(e.target.value);
                        setModError("");
                      }}
                      placeholder="Şifre / Password..."
                      className="bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-green-400/40"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const storedPassword = localStorage.getItem("weew_moderator_password") || "inanmod";
                        const cleaned = modPasswordInput.trim().toLowerCase();
                        if (cleaned === storedPassword.trim().toLowerCase()) {
                          const nextRoles = [...unlockedRoles];
                          if (!nextRoles.includes("moderator")) {
                            nextRoles.push("moderator");
                          }
                          saveUnlockedRoles(nextRoles);
                          setTestRole("moderator");
                          localStorage.setItem("weew_chat_test_role", "moderator");

                          const now = new Date();
                          const modMsg: ChatMessage = {
                            id: `mod-alert-${Date.now()}-${Math.random()}`,
                            user: "KickBot",
                            role: "moderator",
                            text: lang === "TR"
                              ? `🛡️ [YAYIN ALERTI] ${guestNickname || (currentUser ? currentUser.name : "Gezgin")} yetkilendirildi ve kanal MODERATÖRÜ yapıldı! Lütfen düzeni koru! 💚`
                              : `🛡️ [STREAM ALERT] ${guestNickname || (currentUser ? currentUser.name : "Guest")} has been authorized as channel MODERATOR! Keep the chat safe! 💚`,
                            timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                          };
                          setMessages((prev) => [...prev.slice(-79), modMsg]);
                          setQuestTargetRole(null);
                        } else {
                          setModError(lang === "TR" ? "Geçersiz şifre!" : "Incorrect password!");
                        }
                        if (audioEnabled) {
                          playPopSound();
                        }
                      }}
                      className="bg-[#00e676] hover:bg-[#00c862] text-black px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      {lang === "TR" ? "Giriş" : "Enter"}
                    </button>
                  </div>
                  {modError && <p className="text-red-400 text-[9px] mt-1.5 font-bold">{modError}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 pt-2.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuestTargetRole(null)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-gray-400 hover:text-white transition uppercase font-bold cursor-pointer"
            >
              {lang === "TR" ? "Kapat" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0b10] border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isStreamLive ? "bg-[#00e676]" : "bg-red-500"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isStreamLive ? "bg-[#00e676]" : "bg-red-500"}`}></span>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {lang === "TR" ? "CANLI SOHBET" : "LIVE CHAT"}
          </h3>
          {isChatPaused && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-semibold uppercase">
              {lang === "TR" ? "DURAKLATILDI" : "PAUSED"}
            </span>
          )}
          
          {/* Channel Points count in Chat Header */}
          <div className="flex items-center gap-1 bg-[#00e676]/10 border border-[#00e676]/20 px-2.5 py-0.5 rounded-full select-none ml-1.5 relative" title={lang === "TR" ? "Kanal Puanı" : "Channel Points"}>
            <span className="text-[9px] font-black text-[#00e676] tracking-wider">💎 {channelPoints}</span>
            {showPointsGain && (
              <span className="text-[9px] text-[#00e676] font-extrabold absolute -top-4 left-4 animate-bounce">
                +{showPointsGain}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Audio Sound FX Toggle */}
          <button
            onClick={() => {
              const newVal = !audioEnabled;
              setAudioEnabled(newVal);
              localStorage.setItem("weew_chat_audio", newVal ? "true" : "false");
              if (newVal) playPopSound();
            }}
            title={audioEnabled 
              ? (lang === "TR" ? "Sohbet Sesini Kapat" : "Mute Chat Sound") 
              : (lang === "TR" ? "Sohbet Sesini Aç" : "Unmute Chat Sound")}
            className={`p-1.5 rounded-lg transition ${audioEnabled ? "text-[#00e676]" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
          >
            <Volume2 className={`h-3.5 w-3.5 ${audioEnabled ? "opacity-100" : "opacity-50"}`} />
          </button>

          {/* Pause/Resume Stream button - Only for ADMIN */}
          {currentUser?.role === "admin" && (
            <button
              onClick={() => handleToggleChatPaused(!isChatPaused)}
              title={isChatPaused 
                ? (lang === "TR" ? "Akışı Devam Ettir" : "Resume auto scroll") 
                : (lang === "TR" ? "Akışı Duraklat" : "Pause auto scroll")}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              {isChatPaused ? <Play className="h-3.5 w-3.5 text-[#00e676]" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Quick Nickname config modal */}
          {!currentUser && (
            <button
              onClick={() => {
                setTempNick(guestNickname);
                setShowNickSettings(!showNickSettings);
              }}
              title={lang === "TR" ? "Kullanıcı Adı Değiştir" : "Change Nickname"}
              className={`p-1.5 rounded-lg transition ${showNickSettings ? "text-[#00e676] bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Clear chat for ADMIN */}
          {currentUser?.role === "admin" && (
            <button
              onClick={handleClearChat}
              title={lang === "TR" ? "Sohbeti Temizle" : "Clear Chat"}
              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Admin Quick Options Row */}
      {(currentUser?.role === "admin" || testRole === "admin") && (
        <div className="px-4 py-2 bg-[#12131d] border-b border-white/5 flex flex-wrap gap-2 items-center justify-between text-[11px] text-gray-400 select-none">
          <span className="font-bold text-purple-400 flex items-center gap-1">
            <Crown className="h-3 w-3 text-purple-400" /> {lang === "TR" ? "Yönetici Paneli" : "Admin Panel"}
          </span>
          <div className="flex items-center flex-wrap gap-3">
            {/* Badge Color Picker */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
              <span className="text-[10px] text-gray-400 mr-0.5">
                {lang === "TR" ? "Rozet Rengi:" : "Badge Color:"}
              </span>
              {(["red", "blue", "green", "purple", "pink", "amber", "cyan", "emerald"] as const).map((color) => {
                let bgDot = "bg-red-500";
                if (color === "blue") bgDot = "bg-blue-500";
                else if (color === "green") bgDot = "bg-green-500";
                else if (color === "purple") bgDot = "bg-purple-500";
                else if (color === "pink") bgDot = "bg-pink-500";
                else if (color === "amber") bgDot = "bg-amber-500";
                else if (color === "cyan") bgDot = "bg-cyan-500";
                else if (color === "emerald") bgDot = "bg-emerald-500";

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setAdminBadgeColor(color);
                      localStorage.setItem("weew_admin_badge_color", color);
                    }}
                    title={color.toUpperCase()}
                    className={`h-3 w-3 rounded-full ${bgDot} transition-transform hover:scale-125 focus:outline-none ${
                      adminBadgeColor === color ? "ring-2 ring-white ring-offset-1 ring-offset-[#12131d]" : "opacity-60"
                    }`}
                  />
                );
              })}
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
              <input 
                type="checkbox" 
                checked={slowMode} 
                onChange={(e) => handleToggleSlowMode(e.target.checked)} 
                className="rounded bg-black border-white/10 accent-[#00e676] focus:ring-0 h-3 w-3 cursor-pointer"
              />
              <span>{lang === "TR" ? "Yavaş Mod (3s)" : "Slow Mode (3s)"}</span>
            </label>
            <button 
              onClick={handleClearChat} 
              className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[10px]"
            >
              [ {lang === "TR" ? "Temizle" : "Clear"} ]
            </button>
          </div>
        </div>
      )}

      {/* Guest Nickname Settings Popover */}
      {showNickSettings && (
        <form onSubmit={handleSaveNickname} className="absolute top-12 left-2 right-2 p-4 bg-[#11121d] border border-white/10 rounded-2xl shadow-2xl z-40 animate-fade-in">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5 uppercase">
            <Settings className="h-3.5 w-3.5 text-[#00e676]" />
            {lang === "TR" ? "Rumuz (Nickname) Değiştir" : "Edit Guest Nickname"}
          </h4>
          <p className="text-[10px] text-gray-400 mb-3">
            {lang === "TR" 
              ? "Sohbette görünecek adınızı belirleyin (3-15 karakter)." 
              : "Choose how you will appear in the chat stream (3-15 chars)."}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempNick}
              onChange={(e) => setTempNick(e.target.value.slice(0, 15))}
              placeholder="Nickname"
              className="flex-1 bg-[#090a10] border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00e676]/50"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#00e676] hover:bg-[#00c862] text-black text-xs font-bold px-4 py-1.5 rounded-xl transition"
            >
              {lang === "TR" ? "Kaydet" : "Save"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowNickSettings(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-white transition"
          >
            <span className="text-xs uppercase font-bold text-gray-400 hover:text-white">x</span>
          </button>
        </form>
      )}

      {/* Pinned Message Banner */}
      {pinnedMessage && !isPinnedDismissed && (
        <div className="mx-4 mt-2 p-2.5 bg-[#0a2615]/90 border border-[#00e676]/30 rounded-xl flex items-start gap-2 text-[11px] text-gray-300 relative group/pin animate-fade-in shadow-lg shrink-0">
          <span className="text-xs shrink-0 select-none">📌</span>
          <div className="flex-1 min-w-0 pr-5">
            {isEditingPin ? (
              <form onSubmit={handleSavePin} className="flex gap-1.5 items-center w-full mt-0.5">
                <input
                  type="text"
                  value={tempPin}
                  onChange={(e) => setTempPin(e.target.value.slice(0, 150))}
                  placeholder={lang === "TR" ? "Pin mesajı yaz..." : "Enter pin message..."}
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#00e676]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#00e676] hover:bg-[#00c862] text-black font-extrabold text-[10px] px-2.5 py-1 rounded-md transition shrink-0"
                >
                  {lang === "TR" ? "Koru" : "Pin"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPin(false)}
                  className="text-gray-400 hover:text-white text-[10px] shrink-0 font-bold px-1"
                >
                  ✕
                </button>
              </form>
            ) : (
              <div className="font-sans font-medium text-gray-200 break-words leading-relaxed select-text">
                {censorText(pinnedMessage, censoredWords)}
                {currentUser?.role === "admin" && (
                  <button
                    onClick={() => {
                      setTempPin(pinnedMessage);
                      setIsEditingPin(true);
                    }}
                    className="ml-1.5 text-[10px] text-purple-400 font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    [ {lang === "TR" ? "Düzenle" : "Edit"} ]
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsPinnedDismissed(true)}
            className="absolute right-2 top-2 text-gray-500 hover:text-white transition p-0.5 text-[10px] leading-none"
            title={lang === "TR" ? "Kapat" : "Close"}
          >
            ✕
          </button>
        </div>
      )}

      {/* Pinned Message Restore indicator */}
      {pinnedMessage && isPinnedDismissed && (
        <div className="px-4 py-1 bg-green-500/10 border-b border-green-500/10 flex items-center justify-between text-[10px] text-green-400 select-none animate-fade-in shrink-0">
          <span className="truncate pr-4">📌 {censorText(pinnedMessage, censoredWords)}</span>
          <button
            onClick={() => setIsPinnedDismissed(false)}
            className="text-[9px] font-bold uppercase tracking-wider text-green-400 hover:text-green-300 underline shrink-0"
          >
            {lang === "TR" ? "Göster" : "Show"}
          </button>
        </div>
      )}

      {/* Chat Messages Feed Container */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 custom-scrollbar bg-black/20"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Smile className="h-8 w-8 text-gray-600 mb-2 animate-pulse" />
            <p className="text-xs text-gray-500 font-semibold">
              {lang === "TR" ? "Sohbet bomboş... İlk yazan sen ol!" : "Chat is empty... Be the first to say hi!"}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`group flex items-start text-[13px] leading-relaxed p-2.5 rounded-2xl transition hover:bg-white/[0.03] relative mb-1.5 ${
                msg.isSystem 
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-200" 
                  : msg.isUser 
                    ? "bg-[#00e676]/5 border border-white/5 hover:border-white/10" 
                    : ""
              }`}
            >
              {/* Dynamic colorful gamer avatar for user, or cute console icon for system */}
              {!msg.isSystem && (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(msg.user)} flex items-center justify-center text-white text-[11px] font-black uppercase tracking-wider shrink-0 shadow-md border border-white/10 select-none mr-3`}>
                  {msg.user.substring(0, 2)}
                </div>
              )}
              {msg.isSystem && (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs shrink-0 mr-3 border border-amber-500/30">
                  🤖
                </div>
              )}

              {/* Message content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center flex-wrap gap-1 mb-1">
                  {/* Username */}
                  {msg.isSystem ? (
                    <span className={`font-black text-xs uppercase tracking-wide ${getNameColorClass(msg.role)}`}>
                      {msg.user}
                    </span>
                  ) : (
                    <button 
                      onClick={() => {
                        if (!currentUser) {
                          setTempNick(msg.user);
                          setGuestNickname(msg.user);
                          localStorage.setItem("weew_kick_guest_nick", msg.user);
                        }
                      }}
                      className={`font-black text-xs transition hover:underline truncate max-w-[140px] text-left ${getNameColorClass(msg.role)}`}
                      title={lang === "TR" ? "Adını sohbette kopyala" : "Adopt this guest name"}
                    >
                      {msg.user}
                    </button>
                  )}

                  {/* Badge if available */}
                  {renderBadge(msg.role, msg)}

                  {/* Time stamp */}
                  <span className="text-[10px] text-gray-500 font-mono select-none ml-auto">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Text content */}
                <span className={`font-sans break-words selection:bg-[#00e676]/20 block ${msg.isSystem ? "text-amber-100 font-medium" : "text-gray-200"}`}>
                  {censorText(msg.text, censoredWords)}
                </span>
              </div>

              {/* Trash/Delete Action for ADMIN */}
              {currentUser?.role === "admin" && (
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition duration-150"
                  title={lang === "TR" ? "Mesajı Sil" : "Delete Message"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Pause/Jump Down Notification */}
      {!isAutoScroll && messages.length > 0 && (
        <button
          onClick={() => {
            setIsAutoScroll(true);
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }}
          className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-20 bg-purple-600/90 hover:bg-purple-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-purple-500 shadow-lg backdrop-blur-md transition flex items-center gap-1"
        >
          <span>{lang === "TR" ? "Yeni Mesajlar Var ⬇️" : "New Messages ⬇️"}</span>
        </button>
      )}

      {/* Interactive Quick Emotes and Flying Actions Row */}
      <div className="px-3 py-1.5 bg-[#0a0b10] border-t border-white/5 flex items-center justify-between gap-1 overflow-x-auto select-none no-scrollbar">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] text-gray-500 font-bold shrink-0">{lang === "TR" ? "Hızlı Emote:" : "Quick:"}</span>
          {QUICK_EMOTES.map((emote) => (
            <button
              key={emote}
              onClick={() => sendDirectEmote(emote)}
              className="text-sm px-1.5 py-0.5 rounded-md hover:bg-white/10 active:scale-95 transition"
              title={`Send ${emote}`}
            >
              {emote}
            </button>
          ))}
        </div>
        
        {/* Heart Tap effect trigger */}
        <button
          onClick={() => sendReaction("❤️")}
          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 p-1 rounded-md transition active:scale-90"
          title={lang === "TR" ? "Sohbete kalp gönder!" : "Send hearts!"}
        >
          ❤️
        </button>
      </div>

      {/* Emote Picker Panel */}
      {showEmotePicker && (
        <div className="absolute bottom-36 left-4 right-4 bg-[#11121d] border border-white/10 rounded-2xl p-3 shadow-2xl z-40 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {lang === "TR" ? "🎮 GAMER İFADELERİ" : "🎮 GAMER EMOTES"}
            </span>
            <button
              type="button"
              onClick={() => setShowEmotePicker(false)}
              className="text-gray-500 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-8 gap-2 max-h-[120px] overflow-y-auto no-scrollbar py-1">
            {["🔥", "😂", "👑", "😮", "🎯", "GG", "⚔️", "👍", "❤️", "💀", "🎉", "👀", "🤔", "🚀", "💯", "👏", "💥", "🙌", "😎", "🌟", "🎮", "👾", "🍿", "👽", "🥶", "🤩", "🤯", "😈", "🤫", "👋", "✍️"].map((emote) => (
              <button
                key={emote}
                type="button"
                onClick={() => {
                  setInputText((prev) => {
                    const space = prev ? " " : "";
                    return `${prev}${space}${emote}`;
                  });
                  setShowEmotePicker(false);
                  if (audioEnabled) {
                    playPopSound();
                  }
                }}
                className="text-xl p-1 hover:bg-white/10 rounded-lg active:scale-95 transition flex items-center justify-center"
              >
                {emote}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Active Badge Tester & Role Selector */}
      <div className="px-3 py-1.5 bg-[#12131d]/60 border-t border-white/5 flex items-center justify-between gap-1 flex-wrap text-[10px]">
        <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] shrink-0">
          {lang === "TR" ? "🎭 ROL SEÇİMİ (GÖREVLER):" : "🎭 ROLE UNLOCKS (QUESTS):"}
        </span>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {(currentUser?.role === "admin"
            ? (["user", "subscriber", "vip", "moderator", "admin"] as const)
            : (["user", "subscriber", "vip", "moderator"] as const)).map((role) => {
            const isUnlocked = currentUser?.role === "admin" || unlockedRoles.includes(role);
            const isSelected = testRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  if (isUnlocked) {
                    setTestRole(role);
                    localStorage.setItem("weew_chat_test_role", role);
                    if (audioEnabled) {
                      playPopSound();
                    }
                  } else {
                    setQuestTargetRole(role as any);
                    setModPasswordInput("");
                    setModError("");
                    setTriviaQuestionIndex(Math.floor(Math.random() * VIP_TRIVIA_QUESTIONS.length));
                    setSelectedTriviaOption(null);
                    setTriviaAnswerResult(null);
                    if (audioEnabled) {
                      playPopSound();
                    }
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition flex items-center gap-1.5 uppercase select-none ${
                  isSelected
                    ? "bg-[#00e676]/20 border-[#00e676] text-[#00e676] shadow-[0_0_8px_rgba(0,230,118,0.2)]"
                    : isUnlocked
                      ? "bg-white/[0.04] border-white/10 text-gray-300 hover:text-white hover:border-white/20"
                      : "bg-black/40 border-dashed border-white/5 text-gray-500 hover:text-gray-400 hover:border-white/10 cursor-pointer"
                }`}
              >
                {role === "user" && (lang === "TR" ? "İzleyici" : "Guest")}
                {role === "subscriber" && (lang === "TR" ? "Abone" : "Sub")}
                {role === "vip" && "VIP"}
                {role === "moderator" && "Mod"}
                {role === "admin" && "Admin"}
                {!isUnlocked && (
                  <span className="text-[9px]" title={lang === "TR" ? "Görevi tamamlayarak kilidini aç" : "Unlock via Quest"}>🔒</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Message Form */}
      <div className="p-3 bg-[#0a0b10] border-t border-white/5 relative z-10">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setShowEmotePicker(!showEmotePicker)}
              className={`absolute left-3 top-3 text-gray-500 hover:text-[#00e676] transition ${showEmotePicker ? "text-[#00e676]" : ""}`}
              title={lang === "TR" ? "İfade Seçici" : "Emote Picker"}
            >
              <Smile className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 100))}
              disabled={slowMode && slowCountdown > 0 && !(currentUser?.role === "admin" || testRole === "admin")}
              placeholder={
                slowMode && slowCountdown > 0 && !(currentUser?.role === "admin" || testRole === "admin")
                  ? (lang === "TR" ? `${slowCountdown}s saniye bekleyin...` : `Wait ${slowCountdown}s...`)
                  : (currentUser 
                      ? translations.kickSendMessage 
                      : (lang === "TR" ? `${guestNickname} olarak yaz...` : `Chatting as ${guestNickname}...`))
              }
              className={`w-full bg-[#11121d] border rounded-2xl pl-10 pr-12 py-2.5 text-xs text-white focus:outline-none focus:ring-0 transition ${
                slowMode && slowCountdown > 0 && !(currentUser?.role === "admin" || testRole === "admin")
                  ? "border-red-500/30 text-gray-500" 
                  : "border-white/5 focus:border-[#00e676]/40"
              }`}
            />
            {inputText.length > 0 && (
              <span className="absolute right-3 top-3.5 text-[10px] text-gray-500 font-mono">
                {100 - inputText.length}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputText.trim() || (slowMode && slowCountdown > 0 && !(currentUser?.role === "admin" || testRole === "admin"))}
            className={`px-3 py-2.5 rounded-2xl font-bold flex items-center justify-center transition shrink-0 ${
              inputText.trim() && !(slowMode && slowCountdown > 0 && !(currentUser?.role === "admin" || testRole === "admin"))
                ? "bg-[#00e676] hover:bg-[#00c862] text-black"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Guest Tips */}
        {!currentUser && (
          <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
            <span>
              {lang === "TR" 
                ? "Giriş yaparak özel Subscriber rozeti kazanabilirsin." 
                : "Log in to earn a premium Subscriber badge."}
            </span>
            <button
              onClick={() => {
                const btn = document.getElementById("header-login-btn");
                if (btn) btn.click();
              }}
              className="text-purple-400 font-bold hover:underline"
            >
              {lang === "TR" ? "Giriş Yap" : "Log In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
