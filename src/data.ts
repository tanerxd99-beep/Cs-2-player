import { SocialItem, SpecItem, CS2Setting, FAQItem, PlaylistItem, ShortItem, TranslationDict } from "./types";

export const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "kick",
    name: "Kick",
    username: "/inan",
    url: "https://kick.com/inan",
    iconName: "Tv",
    themeColor: "bg-[#00e676]/10 text-[#00e676] border-[#00e676]/20",
    hoverColor: "hover:border-[#00e676] hover:bg-[#00e676]/20 hover:shadow-[0_0_15px_rgba(0,230,118,0.3)]"
  },
  {
    id: "instagram",
    name: "Instagram",
    username: "@inan",
    url: "https://instagram.com/inan",
    iconName: "Instagram",
    themeColor: "bg-[#e1306c]/10 text-[#e1306c] border-[#e1306c]/20",
    hoverColor: "hover:border-[#e1306c] hover:bg-[#e1306c]/20 hover:shadow-[0_0_15px_rgba(225,48,108,0.3)]"
  },
  {
    id: "youtube",
    name: "YouTube",
    username: "@inan",
    url: "https://youtube.com/@inan",
    iconName: "Youtube",
    themeColor: "bg-[#ff0000]/10 text-[#ff0000] border-[#ff0000]/20",
    hoverColor: "hover:border-[#ff0000] hover:bg-[#ff0000]/20 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]"
  },
  {
    id: "tiktok",
    name: "TikTok",
    username: "@inan",
    url: "https://tiktok.com/@inan",
    iconName: "Video",
    themeColor: "bg-[#00f2fe]/10 text-white border-white/10",
    hoverColor: "hover:border-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
  },
  {
    id: "discord",
    name: "Discord",
    username: "Sunucuya Katıl",
    url: "https://discord.gg/inan",
    iconName: "MessageSquare",
    themeColor: "bg-[#5865f2]/10 text-[#5865f2] border-[#5865f2]/20",
    hoverColor: "hover:border-[#5865f2] hover:bg-[#5865f2]/20 hover:shadow-[0_0_15px_rgba(88,101,242,0.3)]"
  }
];

export const SYSTEM_SPECS: SpecItem[] = [
  { category: "CPU (İşlemci)", name: "AMD Ryzen 7 7800X3D", value: "4.2GHz (5.0GHz Turbo) 8-Core 96MB Cache" },
  { category: "GPU (Ekran Kartı)", name: "Galax GeForce RTX 4070 Ti Super", value: "EX Gamer 1-Click OC 16GB GDDR6X" },
  { category: "RAM (Bellek)", name: "G.Skill Flare X5 32GB (2x16GB)", value: "6000MHz CL30 DDR5" },
  { category: "Motherboard (Anakart)", name: "MSI PRO B650M-A WiFi", value: "AMD B650 Socket AM5 DDR5 6400MHz" },
  { category: "Monitor (Monitör)", name: "BenQ ZOWIE XL2566K", value: "24.5\" 360Hz 0.5ms DyAc⁺ TN Gaming Monitor" },
  { category: "Mouse (Fare)", name: "Logitech G Pro X Superlight 2", value: "LIGHTSPEED Wireless Dual-Engine 95g" },
  { category: "Keyboard (Klavye)", name: "Wooting 60HE", value: "60% Analog Hall Effect Keyboard with Rapid Trigger" },
  { category: "Headset (Kulaklık)", name: "HyperX Cloud III Wireless", value: "DTS Headphone:X Spatial Audio Gaming Headset" },
  { category: "Mousepad (Fare Altlığı)", name: "Artisan Ninja FX Zero Mid XL", value: "Japanese Precision Speed-Control Surface" },
  { category: "Microphone (Mikrofon)", name: "Shure SM7B", value: "Cardioid Dynamic Studio Vocal Microphone" }
];

export const CS2_SETTINGS: CS2Setting[] = [
  // Mouse
  { label: "DPI", value: "800", category: "mouse" },
  { label: "Polling Rate", value: "1000 Hz", category: "mouse" },
  { label: "In-Game Sensitivity", value: "1.10", category: "mouse" },
  { label: "Zoom Sensitivity", value: "1.00", category: "mouse" },
  { label: "eDPI", value: "880", category: "mouse" },
  { label: "Windows Sensitivity", value: "6/11 (Raw Input On)", category: "mouse" },

  // Video
  { label: "Resolution", value: "1280x960 (4:3 Stretched)", category: "video" },
  { label: "Refresh Rate", value: "360 Hz", category: "video" },
  { label: "Display Mode", value: "Fullscreen", category: "video" },
  { label: "Global Shadow Quality", value: "Shadows Low (Boost Player Contrast On)", category: "video" },
  { label: "Model / Texture Detail", value: "Low", category: "video" },
  { label: "Shader Detail", value: "Low", category: "video" },
  { label: "Particle Detail", value: "Low", category: "video" },
  { label: "Ambient Occlusion", value: "Disabled", category: "video" },
  { label: "Multisampling Anti-Aliasing", value: "8x MSAA", category: "video" },
  { label: "Texture Filtering Mode", value: "Anisotropic 4x", category: "video" },
  { label: "NVIDIA Reflex Low Latency", value: "Enabled + Boost", category: "video" },

  // Launch Options
  { label: "Primary Settings", value: "-novid -tickrate 128 -allow_third_party_software +fps_max 0 -freq 360", category: "launch" }
];

export const CROSSHAIR_CODE = "CSGO-7yH6o-mUenO-pL98k-zX7zN-98D7M";
export const CROSSHAIR_CONSOLE = "cl_crosshairsize 2; cl_crosshairgap -2; cl_crosshairthickness 1; cl_crosshaircolor 4; cl_crosshair_drawoutline 1; cl_crosshairdot 0; cl_crosshair_t 0;";

export const PLAYLISTS: PlaylistItem[] = [
  {
    id: "playlist-1",
    title: "Faceit Maçlarım",
    videoCount: 24,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    url: "https://youtube.com/playlist?list=PL_faceit"
  },
  {
    id: "playlist-2",
    title: "Premier & MM Maçlarım",
    videoCount: 10,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    url: "https://youtube.com/playlist?list=PL_premier"
  },
  {
    id: "playlist-3",
    title: "Sıfırdan Global Yolculuğu",
    videoCount: 18,
    thumbnail: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop",
    url: "https://youtube.com/playlist?list=PL_global"
  },
  {
    id: "playlist-4",
    title: "Klipler & En İyi Anlar",
    videoCount: 42,
    thumbnail: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop",
    url: "https://youtube.com/playlist?list=PL_highlights"
  }
];

export const SHORTS: ShortItem[] = [
  {
    id: "short1",
    title: "CS2'de 1v5 Clutch Nasıl Atılır? (Taktik Verdim)",
    views: "124K",
    thumbnail: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=300&auto=format&fit=crop",
    duration: "0:58",
    youtubeId: "mock1"
  },
  {
    id: "short2",
    title: "Zowie 360Hz Gerçekten Fark Ediyor Mu? Deneyimledim!",
    views: "89K",
    thumbnail: "https://images.unsplash.com/photo-1527690786676-e17f6920f003?q=80&w=300&auto=format&fit=crop",
    duration: "0:45",
    youtubeId: "mock2"
  },
  {
    id: "short3",
    title: "Wooting Klavye ile Rapid Trigger Ayarı",
    views: "156K",
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=300&auto=format&fit=crop",
    duration: "0:52",
    youtubeId: "mock3"
  }
];

export const FAQS: FAQItem[] = [
  {
    questionTR: "Hangi takımdasın ve kaç yaşındasın?",
    questionEN: "Which team are you on and how old are you?",
    answerTR: "Profesyonel bir takımda değilim, şu anda tam zamanlı yayıncı ve CS2 içerik üreticisiyim. 23 yaşındayım.",
    answerEN: "I am not on a professional team; I am currently a full-time streamer and CS2 content creator. I am 23 years old."
  },
  {
    questionTR: "Yayında hangi çözünürlüğü kullanıyorsun?",
    questionEN: "What resolution do you use on stream?",
    answerTR: "CS2'de genellikle 1280x960 stretched (4:3 oranında) çözünürlüğünü tercih ediyorum. Bu şekilde modeller daha geniş görünüyor.",
    answerEN: "In CS2, I usually prefer 1280x960 stretched (4:3 aspect ratio). This makes player models appear wider."
  },
  {
    questionTR: "Zowie XL2566K DyAc ayarın nedir?",
    questionEN: "What is your Zowie XL2566K DyAc setting?",
    answerTR: "DyAc+ ayarım 'Premium' olarak açık durumda. Parlaklığı dengeliyor ve sprey atarken mermi takibini çok kolaylaştırıyor.",
    answerEN: "My DyAc+ is set to 'Premium'. It balances brightness and makes bullet tracking extremely easy during spraying."
  },
  {
    questionTR: "Haftalık yayın programın nasıl?",
    questionEN: "What is your weekly streaming schedule?",
    answerTR: "Pazartesi hariç her gün saat 19:00'da Kick kanalında canlı yayındayım! Turnuvalar ve özel turnuva günlerinde saatler değişiklik gösterebilir.",
    answerEN: "I am live every day except Monday at 19:00 (7 PM) UTC+3 on my Kick channel! Schedule might change on tournament days."
  }
];

export const TRANSLATIONS: Record<"TR" | "EN", TranslationDict> = {
  TR: {
    navHome: "Anasayfa",
    navSystem: "Sistem",
    navCrosshair: "Crosshair",
    navSettings: "Ayarlar",
    navAbout: "Hakkımızda",
    navContact: "İletişim",
    
    socialMediaTitle: "SOSYAL MEDYA",
    socialMediaSub: "Beni Takip Et",
    socialMediaFollow: "Takip Et",
    
    kickLiveTitle: "KİCK CANLI YAYIN",
    kickLiveSub: "Canlı Yayın",
    kickOffline: "ÇEVRİMDIŞI",
    kickLive: "CANLI",
    kickGoToStream: "YAYINA GİT & SOHBET ET",
    kickChatTitle: "Canlı Yayın Sohbet Simülatörü",
    kickJoinChat: "Sohbete Katıl",
    kickSendMessage: "Mesaj gönder...",
    kickStreamStatusText: "İnan çevrimdışı",
    
    shortsTitle: "YOUTUBE SHORTS",
    shortsSub: "Son Paylaşımlar",
    shortsFetchError: "YouTube verileri yüklenemedi. (ERR: YouTube fetch failed)",
    shortsRetry: "Yeniden Dene & Simüle Et",
    
    playlistsTitle: "YOUTUBE PLAYLİSTLER",
    playlistsSub: "Oynatma Listeleri",
    playlistsButton: "Oynatma listesinin tamamını görüntüle",
    
    aboutTitle: "HAKKIMIZDA",
    aboutSub: "İnan Kimdir?",
    aboutBio: "Selamlar! Ben İnan. CS2 arenasında rekabetçi maçlar oynayan, güncel taktikleri inceleyen ve ekipman testleri yapan bir yayıncı ve içerik üreticisiyim. Yayınlarımda genellikle yüksek seviyeli Faceit maçları, izleyici lobileri ve topluluk turnuvaları düzenliyorum. Sıkı dostlukların ve eğlencenin olduğu topluluğumuza hoş geldin!",
    aboutStatsTitle: "Yayın İstatistikleri",
    aboutFavGames: "Favori Oyunlar",
    
    contactTitle: "BANA ULAŞIN",
    contactSub: "İletişim",
    contactName: "Adınız",
    contactEmail: "E-posta Adresiniz",
    contactMessage: "Mesajınız",
    contactSubmit: "Mesajı Gönder",
    contactSuccess: "Mesajınız başarıyla gönderildi! Teşekkürler.",
    
    systemTitle: "SİSTEM ÖZELLİKLERİ",
    systemSub: "Ekipman ve Donanım",
    systemPart: "Parça / Ekipman",
    systemSpec: "Model ve Teknik Detaylar",
    
    crossTitle: "CS2 CROSSHAİR AYARLARI",
    crossSub: "Nişangah Kodu",
    crossCopyCode: "KODU KOPYALA",
    crossCopied: "KOPYALANDI!",
    crossPreviewOn: "Arka Plan Değiştir:",
    crossBgDesert: "Dust II (Çöl)",
    crossBgIndustrial: "Nuke (Sanayi)",
    crossBgNight: "Inferno (Gece)",
    crossBgAim: "Aim Map (Poligon)",
    
    settingsTitle: "CS2 OYUN İÇİ AYARLAR",
    settingsSub: "Oyun Ayarları",
    settingsLaunchOptions: "Başlatma Seçenekleri",
    settingsMouse: "Fare Hassasiyeti",
    settingsVideo: "Grafik & Görüntü",
    
    footerDesc: "CS2 Yayıncısı & İçerik Üreticisi.",
    footerSocial: "SOSYAL MEDYA",
    footerOther: "DİĞER",
    footerRights: "TÜM HAKLAR SAKLIDIR.",

    navGiveaway: "Çekiliş",
    navCommunity: "Topluluk",
    giveawayTitle: "İNTERAKTİF ÇEKİLİŞ",
    giveawaySub: "Hediyeler ve Ödüller",
    communityTitle: "TOPLULUK DUVARI",
    communitySub: "İzleyici Mesajları ve Selamlar"
  },
  EN: {
    navHome: "Home",
    navSystem: "System",
    navCrosshair: "Crosshair",
    navSettings: "Settings",
    navAbout: "About Me",
    navContact: "Contact",
    
    socialMediaTitle: "SOCIAL MEDIA",
    socialMediaSub: "Follow Me",
    socialMediaFollow: "Follow",
    
    kickLiveTitle: "KICK LIVE STREAM",
    kickLiveSub: "Live Stream",
    kickOffline: "OFFLINE",
    kickLive: "LIVE",
    kickGoToStream: "GO TO STREAM & CHAT",
    kickChatTitle: "Live Stream Chat Simulator",
    kickJoinChat: "Join the Chat",
    kickSendMessage: "Send a message...",
    kickStreamStatusText: "İnan is offline",
    
    shortsTitle: "YOUTUBE SHORTS",
    shortsSub: "Recent Uploads",
    shortsFetchError: "YouTube data could not be loaded. (ERR: YouTube fetch failed)",
    shortsRetry: "Retry & Simulate Load",
    
    playlistsTitle: "YOUTUBE PLAYLISTS",
    playlistsSub: "Playlists",
    playlistsButton: "View entire playlist",
    
    aboutTitle: "ABOUT ME",
    aboutSub: "Who is İnan?",
    aboutBio: "Hello! I am İnan. I am a streamer and content creator who plays competitive matches in the CS2 arena, reviews modern tactics, and tests high-end hardware. My broadcasts usually feature high-level Faceit matches, viewer lobbies, and community tournaments. Welcome to our gaming community!",
    aboutStatsTitle: "Stream Stats",
    aboutFavGames: "Favorite Games",
    
    contactTitle: "GET IN TOUCH",
    contactSub: "Contact",
    contactName: "Your Name",
    contactEmail: "Your Email",
    contactMessage: "Your Message",
    contactSubmit: "Send Message",
    contactSuccess: "Your message has been sent successfully! Thank you.",
    
    systemTitle: "SYSTEM SPECIFICATIONS",
    systemSub: "Gear & PC Hardware",
    systemPart: "Hardware / Gear",
    systemSpec: "Model & Specs Details",
    
    crossTitle: "CS2 CROSSHAIR CONFIG",
    crossSub: "Crosshair Code",
    crossCopyCode: "COPY CODE",
    crossCopied: "COPIED!",
    crossPreviewOn: "Change Background:",
    crossBgDesert: "Dust II (Desert)",
    crossBgIndustrial: "Nuke (Industrial)",
    crossBgNight: "Inferno (Night)",
    crossBgAim: "Aim Map (Range)",
    
    settingsTitle: "CS2 IN-GAME SETTINGS",
    settingsSub: "Game Settings",
    settingsLaunchOptions: "Launch Options",
    settingsMouse: "Mouse Sensitivity",
    settingsVideo: "Graphics & Display",
    
    footerDesc: "CS2 Streamer & Content Creator.",
    footerSocial: "SOCIAL",
    footerOther: "OTHER",
    footerRights: "ALL RIGHTS RESERVED.",

    navGiveaway: "Giveaway",
    navCommunity: "Community",
    giveawayTitle: "INTERACTIVE RAFFLE",
    giveawaySub: "Giveaways & Rewards",
    communityTitle: "COMMUNITY WALL",
    communitySub: "Viewer Messages & Greetings"
  }
};

export const DEFAULT_GIVEAWAYS = [
  {
    id: "giveaway-active",
    prize: "M4A4 | Temukau (Field-Tested)",
    descriptionTR: "Canlı yayın kutlaması şerefine muazzam CS2 kaplaması çekilişi! Katıl butonuna basıp adını listeye yazdır, canlı kura çekimini izle.",
    descriptionEN: "A magnificent CS2 skin giveaway in honor of our livestream celebration! Hit join, write your name, and watch the live raffle drawing.",
    endTime: new Date(Date.now() + 1200000).toISOString(), // 20 mins from now
    status: "active" as const,
    winner: null,
    entrants: ["cs2_pro_99", "kick_enjoyer", "faceit_demon", "shroud_junior", "heatoN_fan", "lozan_fani", "unlost_pro", "cs2_caner"],
    createdAt: new Date().toISOString()
  },
  {
    id: "giveaway-completed-1",
    prize: "AK-47 | Ice Cooled (Minimal Wear)",
    descriptionTR: "Faceit 10 Level kutlama çekilişi. Kazanan şanslı izleyicimize teslim edildi.",
    descriptionEN: "Faceit Level 10 celebration giveaway. Transferred to our lucky winner.",
    endTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: "completed" as const,
    winner: "LozanGamer",
    entrants: ["cs2_pro_99", "LozanGamer", "faceit_demon", "heatoN_fan", "unlost_pro", "berkay_v1"],
    createdAt: new Date(Date.now() - 90000000).toISOString()
  }
];

export const DEFAULT_COMMUNITY_POSTS = [
  {
    id: "post-pinned-1",
    authorName: "İnan",
    authorAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
    badge: "streamer" as const,
    content: "Topluluk Duvarımıza hoş geldiniz beyler! 🎉 Buradan selamlarınızı iletebilir, yayınlar hakkındaki düşüncelerinizi yazabilirsiniz. Saygılı ve keyifli bir ortam olsun. Akşama saat 19:00'da canlı yayında görüşmek üzere! 🔴🚀",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    likes: 42,
    isPinned: true
  },
  {
    id: "post-1",
    authorName: "Berkay_CS",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    badge: "sub" as const,
    content: "Dün akşamki Faceit maçında attığın 1v5 clutch efsaneydi abi! Klip aldım, Discord klipler kanalına atıyorum hemen.",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    likes: 12
  },
  {
    id: "post-2",
    authorName: "SlayerCS2",
    authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    badge: "vip" as const,
    content: "CS2 crosshair ve fare hassasiyeti ayarlarını kopyaladım, Dust 2'de direkt tek atmaya başladım. Cidden çok rahatmış, eyvallah cansın! 🔫🔥",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    likes: 7
  },
  {
    id: "post-3",
    authorName: "Ayşe_19",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    badge: "user" as const,
    content: "Yayın kalitesi ve sohbet harika, her akşam çayımı alıp keyifle izliyorum. Başarılar İnan abi! ☕🌸",
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    likes: 9
  }
];

