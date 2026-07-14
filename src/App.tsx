import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, BellOff, X, ExternalLink, Copy, Check } from "lucide-react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SocialGrid from "./components/SocialGrid";
import KickLiveSection from "./components/KickLiveSection";
import YouTubeSection from "./components/YouTubeSection";
import CS2SpecsSection from "./components/CS2SpecsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AuthModal, { UserAccount } from "./components/AuthModal";
import AdminPanelModal from "./components/AdminPanelModal";
import { UserProfile } from "./components/EditProfileModal";
import CS2SettingsSection, { CS2SettingsData } from "./components/CS2SettingsSection";
import CrosshairSection, { DEFAULT_CROSSHAIRS } from "./components/CrosshairSection";
import GiveawaySection from "./components/GiveawaySection";
import { TRANSLATIONS, PLAYLISTS, SYSTEM_SPECS } from "./data";
import { CrosshairItem, PlaylistItem, SpecItem, Announcement } from "./types";
import AnnouncementSection from "./components/AnnouncementSection";

const DEFAULT_PROFILE: UserProfile = {
  siteName: "İnan",
  profilePhoto: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
  bioTR: "Selamlar! Ben İnan. CS2 arenasında rekabetçi maçlar oynayan, güncel taktikleri inceleyen ve ekipman testleri yapan bir yayıncı ve içerik üreticisiyim. Yayınlarımda genellikle yüksek seviyeli Faceit maçları, izleyici lobileri ve topluluk turnuvaları düzenliyorum. Sıkı dostlukların ve eğlencenin olduğu topluluğumuza hoş geldin!",
  bioEN: "Greetings! I am Inan. I am a streamer and content creator who plays competitive matches in the CS2 arena, reviews modern tactics, and tests high-end hardware. My broadcasts usually feature high-level Faceit matches, viewer lobbies, and community tournaments. Welcome to our gaming community!",
  kickUsername: "/inan",
  kickUrl: "https://kick.com/inan",
  instagramUsername: "@inan",
  instagramUrl: "https://instagram.com/inan",
  youtubeUsername: "@inan",
  youtubeUrl: "https://youtube.com/@inan",
  tiktokUsername: "@inan",
  tiktokUrl: "https://tiktok.com/@inan",
  discordUsername: "Sunucuya Katıl",
  discordUrl: "https://discord.gg/inan"
};

const DEFAULT_CS2_SETTINGS: CS2SettingsData = {
  mouseDpi: "800",
  mouseSens: "1.25",
  mousePolling: "1000 Hz",

  viewmodelFov: "68",
  viewmodelOffsetX: "1.5",
  viewmodelOffsetY: "-1",
  viewmodelOffsetZ: "-1.5",
  viewmodelPresetpos: "3",
  viewmodelConsoleCode: "viewmodel_fov 68; viewmodel_offset_x 1.5; viewmodel_offset_y -1; viewmodel_offset_z -1.5; viewmodel_presetpos 3;",

  hudColor: "11 (Pembe)",
  hudComment: "// HUD rengi 11 = İnan bişeyleri mi seviyor ki?",

  videoMode: "Tam Ekran Pencereli",
  videoAspect: "4:3",
  videoResolution: "1280x960",
  videoRefresh: "360Hz",
  videoBrightness: "%109",
  videoComment: "// Gelişmiş görüntü ayarları için soldaki videoyu izle",

  crosshairName: "BEYAZ KÜÇÜK CROSS",
  crosshairCode: "CSGO-KmQzd-hmeUU-eOR6w-FN4yd-YCdRF",
  crosshairComment: "// İnan cross değişebilir tüm cross kodları -> burada",
  crosshairType: "small",
  crosshairColor: "#ffffff",
  crosshairSize: "3",
  crosshairThickness: "1.5",
  crosshairGap: "-2",
  crosshairOutline: true,
  crosshairDot: false,

  radarHudScale: "1.004218",
  radarScale: "0.347000",
  radarRotate: "true",
  radarIconScaleMin: "0.6",
  radarConsoleCode: "cl_hud_radar_scale 1.004218; cl_radar_scale 0.347000; cl_radar_rotate true; cl_radar_icon_scale_min 0.6;",

  youtubeVideoUrl: ""
};

export default function App() {
  const [lang, setLang] = useState<"TR" | "EN">("TR");
  const [activeSection, setActiveSection] = useState("home");
  
  const [isStreamLive, setIsStreamLive] = useState<boolean>(() => {
    return localStorage.getItem("weew_is_stream_live") === "true";
  });

  const handleSetIsStreamLive = (val: boolean) => {
    setIsStreamLive(val);
    localStorage.setItem("weew_is_stream_live", val ? "true" : "false");
  };

  // Simulated Kick Live Stream details managed dynamically via Admin Panel
  const [streamCategory, setStreamCategory] = useState<string>(() => {
    return localStorage.getItem("weew_stream_category") || "Counter-Strike 2";
  });
  const [streamTitle, setStreamTitle] = useState<string>(() => {
    return localStorage.getItem("weew_stream_title") || "Rekabetçi Maçlar & Topluluk Yayını";
  });
  const [streamViewers, setStreamViewers] = useState<string>(() => {
    return localStorage.getItem("weew_stream_viewers") || "1400";
  });

  const handleSaveStreamCategory = (val: string) => {
    setStreamCategory(val);
    localStorage.setItem("weew_stream_category", val);
  };

  const handleSaveStreamTitle = (val: string) => {
    setStreamTitle(val);
    localStorage.setItem("weew_stream_title", val);
  };

  const handleSaveStreamViewers = (val: string) => {
    setStreamViewers(val);
    localStorage.setItem("weew_stream_viewers", val);
  };

  // Kick API Auto-Sync Simulation States
  const [kickApiEnabled, setKickApiEnabled] = useState<boolean>(() => {
    return localStorage.getItem("weew_kick_api_enabled") === "true";
  });

  const [kickApiLogs, setKickApiLogs] = useState<string[]>(() => {
    return ["[SYSTEM] Kick API simülatörü hazır. Kanal: 'inan'"];
  });

  const handleSetKickApiEnabled = (enabled: boolean) => {
    setKickApiEnabled(enabled);
    localStorage.setItem("weew_kick_api_enabled", enabled ? "true" : "false");
    
    const timeStr = new Date().toLocaleTimeString("tr-TR");
    if (enabled) {
      handleSetIsStreamLive(true);
      setKickApiLogs(prev => [
        `[${timeStr}] [SYSTEM] Otomatik Kick API senkronizasyonu etkinleştirildi.`,
        `[${timeStr}] [KICK-API] Polling döngüsü başlatıldı: https://api.kick.com/v2/channels/inan/lives`,
        ...prev.slice(0, 12)
      ]);
    } else {
      setKickApiLogs(prev => [
        `[${timeStr}] [SYSTEM] Otomatik Kick API senkronizasyonu kapatıldı.`,
        `[${timeStr}] [KICK-API] Polling durduruldu. Manuel yönetime geçildi.`,
        ...prev.slice(0, 12)
      ]);
    }
  };

  useEffect(() => {
    if (!kickApiEnabled) return;

    // Ensure state is live initially
    handleSetIsStreamLive(true);

    const interval = setInterval(() => {
      const now = new Date();
      const currentLogTime = now.toLocaleTimeString("tr-TR");
      
      // Randomly fluctuate viewer count slightly to make it look live
      let updatedViewers = "1400";
      setStreamViewers(prev => {
        const currentVal = parseInt(prev, 10) || 1400;
        const change = Math.floor(Math.random() * 31) - 15; // -15 to +15
        const newVal = Math.max(120, currentVal + change);
        updatedViewers = newVal.toString();
        localStorage.setItem("weew_stream_viewers", updatedViewers);
        return updatedViewers;
      });

      // Append realistic polling log
      setKickApiLogs(prev => {
        const nextLog = `[${currentLogTime}] [KICK-API] GET /v2/channels/inan - 200 OK | Kategori: ${streamCategory} | İzleyici: ${updatedViewers}`;
        return [nextLog, ...prev.slice(0, 15)];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [kickApiEnabled, streamCategory]);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("weew_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_PROFILE;
  });

  // Browser notifications preference
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem("weew_notifications_enabled") === "true";
  });

  const [notificationPermission, setNotificationPermission] = useState<string>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  const handleToggleNotifications = async () => {
    if (currentUser?.role !== "admin") {
      alert(lang === "TR" ? "Bu özellik sadece yöneticiler (admin) tarafından kullanılabilir." : "This feature is only available to administrators.");
      return;
    }

    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    localStorage.setItem("weew_notifications_enabled", nextState ? "true" : "false");

    // Attempt to request real browser notifications permission in background if supported
    if (typeof window !== "undefined" && "Notification" in window) {
      if (nextState && Notification.permission === "default") {
        try {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
          if (permission === "granted") {
            new Notification(lang === "TR" ? "Bildirimler Etkinleştirildi! 🔔" : "Notifications Enabled! 🔔", {
              body: lang === "TR" ? "Kanal canlı yayına girdiğinde anlık bildirim alacaksınız." : "You will receive instant notifications when the channel goes live.",
              icon: profile.profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"
            });
          }
        } catch (err) {
          console.warn("Background notification permission request failed (likely due to sandbox):", err);
        }
      }
    }

    // Trigger a gorgeous, interactive visual feedback to show notifications are active in-app!
    if (nextState) {
      setLiveToast({
        show: true,
        title: lang === "TR" ? "🔔 Bildirimler Aktifleşti!" : "🔔 Notifications Enabled!",
        body: lang === "TR" 
          ? "Canlı yayınlar başladığında ve oda etkinliklerinde anlık bildirimler alacaksınız." 
          : "You will receive real-time alerts at the bottom of the screen for live streams and events."
      });
      // Auto close after 4 seconds
      setTimeout(() => {
        setLiveToast(prev => prev && (prev.title.includes("Aktifleşti") || prev.title.includes("Enabled")) ? null : prev);
      }, 4000);
    }
  };

  // In-app live notify toast state
  const [liveToast, setLiveToast] = useState<{
    show: boolean;
    title: string;
    body: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  const [userNotifyWhenLive, setUserNotifyWhenLive] = useState<boolean>(() => {
    return localStorage.getItem("weew_user_notify_when_live") === "true";
  });

  const handleToggleUserLiveNotification = async () => {
    const nextState = !userNotifyWhenLive;
    setUserNotifyWhenLive(nextState);
    localStorage.setItem("weew_user_notify_when_live", nextState ? "true" : "false");

    if (nextState && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        try {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
          if (permission === "granted") {
            new Notification(lang === "TR" ? "Bildirimleriniz Açıldı! 🔔" : "Notifications Turned On! 🔔", {
              body: lang === "TR" 
                ? "İnan yayına girdiğinde artık sizi tarayıcı bildirimleriyle haberdar edeceğiz." 
                : "We will now keep you posted with browser notifications when Inan starts streaming.",
              icon: profile.profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"
            });
          }
        } catch (err) {
          console.warn("Notification request permission failed:", err);
        }
      } else if (Notification.permission === "granted") {
        try {
          new Notification(lang === "TR" ? "Bildirim Tercihi Kaydedildi 🔔" : "Notification Preference Saved 🔔", {
            body: lang === "TR" 
              ? "Yayın bildirim hatırlatıcıları başarıyla etkinleştirildi!" 
              : "Stream notification reminders have been successfully enabled!",
            icon: profile.profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"
          });
        } catch (err) {
          console.warn(err);
        }
      } else if (Notification.permission === "denied") {
        alert(lang === "TR" 
          ? "Lütfen tarayıcı ayarlarınızdan bu site için bildirim izinlerini etkinleştirin." 
          : "Please enable notification permissions for this site in your browser settings."
        );
      }
    }
  };

  // Recurring browser-based stream live reminder check
  useEffect(() => {
    if (!userNotifyWhenLive) return;

    if (isStreamLive) {
      const sendReminder = () => {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            new Notification(lang === "TR" ? "🔴 İnan Canlı Yayında!" : "🔴 Inan is Live!", {
              body: lang === "TR" 
                ? `"${streamTitle || 'Kesintisiz Eğlence Başladı!'}" - Yayına katılmak için tıklayın!` 
                : `"${streamTitle || 'Non-stop Entertainment Started!'}" - Click to watch now!`,
              icon: profile.profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
              tag: "kick-live-reminder"
            });
          } catch (e) {
            console.warn(e);
          }
        }
      };

      // Send immediate check on mount/activation
      sendReminder();

      // Recurring reminder interval (e.g., every 5 minutes)
      const reminderInterval = setInterval(() => {
        if (isStreamLive) {
          sendReminder();
        }
      }, 300000); // 5 minutes

      return () => clearInterval(reminderInterval);
    }
  }, [userNotifyWhenLive, isStreamLive, lang, profile.profilePhoto, streamTitle]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(profile.kickUrl || "https://kick.com/inan");
      setCopiedLink(true);
      setTimeout(() => {
        setCopiedLink(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Monitor stream state transitions from offline -> online (false -> true)
  const prevLiveRef = useRef(isStreamLive);

  useEffect(() => {
    if (isStreamLive && !prevLiveRef.current) {
      const title = lang === "TR" ? "🔴 İnan CANLI YAYINDA!" : "🔴 Inan IS NOW LIVE!";
      const body = lang === "TR" 
        ? `"${streamTitle || 'Kesintisiz Eğlence Başladı!'}" - ${streamCategory || 'Sohbet'} yayını başladı, hemen katılın!`
        : `"${streamTitle || 'Non-stop Entertainment Started!'}" - Streaming ${streamCategory || 'Just Chatting'} now!`;

      // 1. Send real browser notification if supported, enabled and granted
      if ((notificationsEnabled || userNotifyWhenLive) && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(title, {
            body: body,
            icon: profile.profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
            tag: "kick-live-stream",
            requireInteraction: true
          });
        } catch (err) {
          console.warn("Failed to dispatch HTML5 browser notification:", err);
        }
      }

      // 2. Always show the gorgeous custom in-app live alert at the top right of the viewport
      setLiveToast({
        show: true,
        title,
        body
      });
    }
    prevLiveRef.current = isStreamLive;
  }, [isStreamLive, notificationsEnabled, streamTitle, streamCategory, profile.profilePhoto, lang]);
  
  // Auth & Admin Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isRegistrationDisabled, setIsRegistrationDisabled] = useState<boolean>(() => {
    return localStorage.getItem("weew_registration_disabled") === "true";
  });

  const handleToggleRegistration = (disabled: boolean) => {
    setIsRegistrationDisabled(disabled);
    localStorage.setItem("weew_registration_disabled", disabled ? "true" : "false");
  };

  // Secret admin backdoor triggers (URL parameter or keyboard shortcut)
  useEffect(() => {
    // 1. URL parameter check (?admin=true or ?giris=true)
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || params.get("login") === "true" || params.get("giris") === "true") {
      setIsAuthModalOpen(true);
      // Clean up URL query parameters without page refresh
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }

    // 2. Keyboard shortcut (Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAuthModalOpen(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem("weew_visitor_count");
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num)) return num;
    }
    const initialSeed = 0;
    localStorage.setItem("weew_visitor_count", initialSeed.toString());
    return initialSeed;
  });

  const handleSaveVisitorCount = (count: number) => {
    setVisitorCount(count);
    localStorage.setItem("weew_visitor_count", count.toString());
  };

  useEffect(() => {
    // Unique visitor check via localStorage
    const hasVisited = localStorage.getItem("weew_has_visited");
    if (!hasVisited) {
      localStorage.setItem("weew_has_visited", "true");
      setVisitorCount(prev => {
        const next = prev + 1;
        localStorage.setItem("weew_visitor_count", next.toString());
        return next;
      });
    }
  }, []);
  
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("weew_logged_in_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  const [cs2Settings, setCs2Settings] = useState<CS2SettingsData>(() => {
    const saved = localStorage.getItem("weew_cs2_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_CS2_SETTINGS;
  });

  const [crosshairs, setCrosshairs] = useState<CrosshairItem[]>(() => {
    const saved = localStorage.getItem("weew_crosshairs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_CROSSHAIRS;
  });

  const [playlists, setPlaylists] = useState<PlaylistItem[]>(() => {
    const saved = localStorage.getItem("weew_playlists");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return PLAYLISTS;
  });

  const [systemSpecs, setSystemSpecs] = useState<SpecItem[]>(() => {
    const saved = localStorage.getItem("weew_system_specs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return SYSTEM_SPECS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("weew_announcements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: "ann-1",
        titleTR: "🌟 Sezonun İlk Büyük Topluluk Turnuvası!",
        titleEN: "🌟 Season's First Major Community Tournament!",
        contentTR: "Selam topluluk! Bu Cuma saat 20:00'de Discord üzerinden 5v5 özel ödüllü turnuvamız başlıyor. Kayıtlar tamamen ücretsizdir ve kazanan takıma seçkin skin ödülleri verilecektir! Detaylar için Discord'da #duyuru kanalına bakmayı unutmayın.",
        contentEN: "Hey community! This Friday at 20:00, our 5v5 special prize tournament kicks off on Discord. Registration is completely free, and the winning team will receive premium skin prizes! Check out the #announcements channel on Discord for details.",
        date: "2026-07-07",
        badgeTR: "TURNUVA",
        badgeEN: "TOURNAMENT",
        importance: "high",
        active: true
      },
      {
        id: "ann-2",
        titleTR: "🚀 Yeni Crosshair ve Başlatma Kodları Eklendi",
        titleEN: "🚀 New Crosshairs & Launch Options Added",
        contentTR: "Zowie XL2566K 360Hz monitörüme geçişimle birlikte kullandığım yeni çözünürlük (1280x960 4:3 stretched) ve en güncel crosshair kodlarımı sizler için panelde paylaştım. Kopyalamak için hemen 'Ayarlar' ve 'Crosshair' sayfasına göz atabilirsiniz!",
        contentEN: "Along with my switch to the Zowie XL2566K 360Hz monitor, I shared my new resolution (1280x960 4:3 stretched) and my latest crosshair codes on the panel. Browse the 'Settings' and 'Crosshair' pages to copy them now!",
        date: "2026-07-06",
        badgeTR: "GÜNCELLEME",
        badgeEN: "UPDATE",
        importance: "medium",
        active: true
      }
    ];
  });

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem("weew_user_profile", JSON.stringify(updated));
  };

  const handleSaveCs2Settings = (updated: CS2SettingsData) => {
    setCs2Settings(updated);
    localStorage.setItem("weew_cs2_settings", JSON.stringify(updated));
  };

  const handleSaveCrosshairs = (updated: CrosshairItem[]) => {
    setCrosshairs(updated);
    localStorage.setItem("weew_crosshairs", JSON.stringify(updated));
  };

  const handleSavePlaylists = (updated: PlaylistItem[]) => {
    setPlaylists(updated);
    localStorage.setItem("weew_playlists", JSON.stringify(updated));
  };

  const handleSaveSystemSpecs = (updated: SpecItem[]) => {
    setSystemSpecs(updated);
    localStorage.setItem("weew_system_specs", JSON.stringify(updated));
  };

  const handleSaveAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    localStorage.setItem("weew_announcements", JSON.stringify(updated));
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem("weew_logged_in_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("weew_logged_in_user");
    setIsAdminPanelOpen(false);
  };

  const translations = TRANSLATIONS[lang];

  // Dynamically constructed social items based on editable state
  const socialItems = [
    {
      id: "kick",
      name: "Kick",
      username: profile.kickUsername,
      url: profile.kickUrl,
      iconName: "Tv",
      themeColor: "bg-[#00e676]/10 text-[#00e676] border-[#00e676]/20",
      hoverColor: "hover:border-[#00e676] hover:bg-[#00e676]/20 hover:shadow-[0_0_15px_rgba(0,230,118,0.3)]"
    },
    {
      id: "instagram",
      name: "Instagram",
      username: profile.instagramUsername,
      url: profile.instagramUrl,
      iconName: "Instagram",
      themeColor: "bg-[#e1306c]/10 text-[#e1306c] border-[#e1306c]/20",
      hoverColor: "hover:border-[#e1306c] hover:bg-[#e1306c]/20 hover:shadow-[0_0_15px_rgba(225,48,108,0.3)]"
    },
    {
      id: "youtube",
      name: "YouTube",
      username: profile.youtubeUsername,
      url: profile.youtubeUrl,
      iconName: "Youtube",
      themeColor: "bg-[#ff0000]/10 text-[#ff0000] border-[#ff0000]/20",
      hoverColor: "hover:border-[#ff0000] hover:bg-[#ff0000]/20 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]"
    },
    {
      id: "tiktok",
      name: "TikTok",
      username: profile.tiktokUsername,
      url: profile.tiktokUrl,
      iconName: "Video",
      themeColor: "bg-[#00f2fe]/10 text-white border-white/10",
      hoverColor: "hover:border-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
    },
    {
      id: "discord",
      name: "Discord",
      username: profile.discordUsername,
      url: profile.discordUrl,
      iconName: "MessageSquare",
      themeColor: "bg-[#5865f2]/10 text-[#5865f2] border-[#5865f2]/20",
      hoverColor: "hover:border-[#5865f2] hover:bg-[#5865f2]/20 hover:shadow-[0_0_15px_rgba(88,101,242,0.3)]"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-[#08090d] text-gray-100 font-sans grid-bg select-none flex flex-col justify-between overflow-x-hidden w-full"
      id="app-root-container"
    >
      {/* Sticky Navigation Header with Auth Bindings */}
      <Header 
        lang={lang} 
        setLang={setLang} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        translations={translations}
        isStreamLive={isStreamLive}
        setIsStreamLive={handleSetIsStreamLive}
        siteName={profile.siteName}
        profilePhoto={profile.profilePhoto}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
      />

      {/* Main View Layout with Animated Page Transitions */}
      <main className="pb-16 flex-1 flex flex-col justify-center" id="app-main-content">
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Hero Section */}
              <HeroSection 
                translations={translations} 
                siteName={profile.siteName} 
                profilePhoto={profile.profilePhoto} 
                isStreamLive={isStreamLive}
              />

              {/* Announcement Banner/Section */}
              <AnnouncementSection 
                translations={translations} 
                announcements={announcements} 
                lang={lang} 
              />

              {/* Social Followers Grid */}
              <SocialGrid 
                translations={translations} 
                socialItems={socialItems} 
              />

              {/* Kick Live Broadcast Block */}
              <KickLiveSection 
                translations={translations} 
                isStreamLive={isStreamLive} 
                setIsStreamLive={handleSetIsStreamLive} 
                siteName={profile.siteName}
                profilePhoto={profile.profilePhoto}
                kickUsername={profile.kickUsername}
                kickUrl={profile.kickUrl}
                currentUser={currentUser}
                streamCategory={streamCategory}
                streamTitle={streamTitle}
                streamViewers={streamViewers}
                lang={lang}
              />

              {/* YouTube Section */}
              <YouTubeSection translations={translations} playlists={playlists} />
            </motion.div>
          )}

          {activeSection === "system" && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* System Hardware Specifications Bento Grid */}
              <CS2SpecsSection translations={translations} specs={systemSpecs} />
            </motion.div>
          )}

          {activeSection === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* CS2 Game Settings Accordion & Smartphone Block */}
              <CS2SettingsSection 
                translations={translations} 
                settings={cs2Settings}
                siteName={profile.siteName}
                onNavigateToSection={setActiveSection}
              />
            </motion.div>
          )}

          {activeSection === "crosshair" && (
            <motion.div
              key="crosshair"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <CrosshairSection 
                translations={translations} 
                settings={cs2Settings}
                siteName={profile.siteName}
                profilePhoto={profile.profilePhoto}
                crosshairs={crosshairs}
              />
            </motion.div>
          )}

          {activeSection === "playlists" && (
            <motion.div
              key="playlists"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <YouTubeSection translations={translations} playlists={playlists} />
            </motion.div>
          )}

          {activeSection === "giveaway" && (
            <motion.div
              key="giveaway"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <GiveawaySection 
                translations={translations} 
                lang={lang} 
                currentUser={currentUser}
              />
            </motion.div>
          )}

          {activeSection === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* About Bio and collapsible FAQs list */}
              <AboutSection 
                translations={translations} 
                lang={lang} 
                siteName={profile.siteName}
                bioTR={profile.bioTR}
                bioEN={profile.bioEN}
              />
            </motion.div>
          )}

          {activeSection === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Contact form submitting directly to Admin Panel message store */}
              <ContactSection translations={translations} lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fully-functional localized footer */}
      <Footer 
        lang={lang} 
        setLang={setLang} 
        setActiveSection={setActiveSection} 
        translations={translations} 
        siteName={profile.siteName}
        profilePhoto={profile.profilePhoto}
        kickUrl={profile.kickUrl}
        instagramUrl={profile.instagramUrl}
        youtubeUrl={profile.youtubeUrl}
        tiktokUrl={profile.tiktokUrl}
        discordUrl={profile.discordUrl}
        visitorCount={visitorCount}
      />

      {/* Auth Modal Component */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            isRegistrationDisabled={isRegistrationDisabled}
          />
        )}
      </AnimatePresence>

      {/* Admin Panel Dashboard Component */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <AdminPanelModal
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            profile={profile}
            onSaveProfile={handleSaveProfile}
            isStreamLive={isStreamLive}
            setIsStreamLive={handleSetIsStreamLive}
            currentUser={currentUser}
            cs2Settings={cs2Settings}
            onSaveCs2Settings={handleSaveCs2Settings}
            crosshairs={crosshairs}
            onSaveCrosshairs={handleSaveCrosshairs}
            streamCategory={streamCategory}
            onSaveStreamCategory={handleSaveStreamCategory}
            streamTitle={streamTitle}
            onSaveStreamTitle={handleSaveStreamTitle}
            streamViewers={streamViewers}
            onSaveStreamViewers={handleSaveStreamViewers}
            playlists={playlists}
            onSavePlaylists={handleSavePlaylists}
            systemSpecs={systemSpecs}
            onSaveSystemSpecs={handleSaveSystemSpecs}
            announcements={announcements}
            onSaveAnnouncements={handleSaveAnnouncements}
            isRegistrationDisabled={isRegistrationDisabled}
            onToggleRegistration={handleToggleRegistration}
            visitorCount={visitorCount}
            onSaveVisitorCount={handleSaveVisitorCount}
            kickApiEnabled={kickApiEnabled}
            onToggleKickApi={handleSetKickApiEnabled}
            kickApiLogs={kickApiLogs}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={handleToggleNotifications}
          />
        )}
      </AnimatePresence>

      {/* Live Stream Fallback/Interactive Toast Alert */}
      <AnimatePresence>
        {liveToast?.show && (
          <motion.div
            initial={{ 
              opacity: 0, 
              x: 0, 
              y: 80, 
              scale: 0.95,
              borderColor: "rgba(0, 230, 118, 0.3)",
              boxShadow: "0 10px 35px rgba(0, 230, 118, 0.15)"
            }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: 0, 
              scale: 1,
              borderColor: [
                "rgba(0, 230, 118, 0.3)",
                "rgba(0, 230, 118, 1)",
                "rgba(0, 230, 118, 0.2)",
                "rgba(0, 230, 118, 1)",
                "rgba(0, 230, 118, 0.3)"
              ],
              boxShadow: [
                "0 10px 35px rgba(0, 230, 118, 0.15)",
                "0 0 25px rgba(0, 230, 118, 0.6)",
                "0 10px 35px rgba(0, 230, 118, 0.15)",
                "0 0 25px rgba(0, 230, 118, 0.6)",
                "0 10px 35px rgba(0, 230, 118, 0.15)"
              ]
            }}
            exit={{ opacity: 0, x: 250, y: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              borderColor: {
                delay: 0.1,
                duration: 1.5,
                ease: "easeInOut"
              },
              boxShadow: {
                delay: 0.1,
                duration: 1.5,
                ease: "easeInOut"
              }
            }}
            className="fixed bottom-6 right-6 z-[9999] w-[320px] sm:w-[360px] rounded-3xl border bg-[#090b11] p-5 overflow-hidden text-left"
            id="live-stream-toast-notification"
          >
            {/* Ambient green continuous border pulse wave effect */}
            <motion.div 
              className="absolute inset-0 rounded-3xl border-2 border-[#00e676]/40 pointer-events-none"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.04 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            />

            {/* Ambient green pulsing background blur */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#00e676]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex gap-4">
              {/* Avatar or Glowing Live Logo */}
              <div className="relative shrink-0">
                <img 
                  src={profile.profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"} 
                  alt={profile.siteName} 
                  className="h-11 w-11 rounded-2xl border border-white/10 object-cover"
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00e676] text-[8px] font-black text-black items-center justify-center">🔴</span>
                </span>
              </div>

              {/* Toast Details */}
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-mono font-black text-[#00e676] uppercase tracking-wider">
                    {lang === "TR" ? "YAYIN BAŞLADI" : "STREAM STARTED"}
                  </h4>
                  <button 
                    onClick={() => setLiveToast(null)}
                    className="text-gray-500 hover:text-white transition rounded-lg p-0.5 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h3 className="font-display text-sm font-extrabold text-white leading-snug">
                  {liveToast.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  {liveToast.body}
                </p>

                {/* Notify Me When Live Toggle Switch */}
                <div className="pt-2 pb-1 border-t border-white/5 mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
                    <Bell className={`h-3.5 w-3.5 ${userNotifyWhenLive ? "text-[#00e676] fill-[#00e676]/20 animate-bounce" : "text-gray-500"}`} />
                    {lang === "TR" ? "Yayınlandığında Haber Ver" : "Notify me when live"}
                  </span>
                  
                  {/* Stylish toggle switch */}
                  <button
                    onClick={handleToggleUserLiveNotification}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      userNotifyWhenLive ? "bg-[#00e676]" : "bg-gray-700"
                    }`}
                    role="switch"
                    aria-checked={userNotifyWhenLive}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0a0b10] shadow ring-0 transition duration-200 ease-in-out ${
                        userNotifyWhenLive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Interactive Action CTA buttons */}
                <div className="pt-3 flex items-center gap-2">
                  <a 
                    href={profile.kickUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => setLiveToast(null)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#00e676] hover:bg-[#00c853] text-black text-[11px] font-black uppercase tracking-wider py-2 transition text-center"
                  >
                    <span>{lang === "TR" ? "YAYINA KATIL" : "WATCH NOW"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 min-w-[90px] justify-center select-none"
                    title={lang === "TR" ? "Yayın Linkini Kopyala" : "Copy Stream Link"}
                  >
                    <AnimatePresence mode="wait">
                      {copiedLink ? (
                        <motion.span
                          key="copied"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1 text-[#00e676]"
                        >
                          <Check className="h-3 w-3" />
                          <span>{lang === "TR" ? "Kopyalandı!" : "Copied!"}</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3 text-gray-400" />
                          <span>{lang === "TR" ? "Kopyala" : "Copy"}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <button 
                    onClick={() => setLiveToast(null)}
                    className="px-3 py-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[11px] font-bold transition cursor-pointer"
                  >
                    {lang === "TR" ? "Kapat" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
