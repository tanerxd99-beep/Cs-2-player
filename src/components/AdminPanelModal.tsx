import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Save, Image, User, Shield, Users, Mail, Tv, 
  Settings2, Trash2, Check, RefreshCw, MessageSquare, AlertCircle, Award,
  Upload, Smartphone, Sliders, Play, Info, Plus, Target, ExternalLink,
  LayoutDashboard, Radio, Eye, Activity, Youtube, Megaphone, Cpu, Layers, Bell,
  Sparkles, Download
} from "lucide-react";
import { UserProfile } from "./EditProfileModal";
import { UserAccount } from "./AuthModal";
import { CS2SettingsData } from "./CS2SettingsSection";
import { CrosshairItem, PlaylistItem, SpecItem, Announcement } from "../types";

const ANNOUNCEMENT_TEMPLATES = [
  {
    name: "🔴 Canlı Yayın Başlangıcı",
    titleTR: "🔴 CANLI YAYIN BAŞLADI! Kaçırma!",
    titleEN: "🔴 WE ARE LIVE! Don't miss it!",
    contentTR: "Beyler/bayanlar, kesintisiz eğlence ve bolca CS2 aksiyonu için yayındayız! Hemen gelin, sohbete katılın ve eğlenceyi kaçırmayın.",
    contentEN: "Hey guys! We are live for non-stop fun and CS2 action! Join now, chat with us, and don't miss out on the hype.",
    badgeTR: "YAYIN",
    badgeEN: "STREAM",
    importance: "high",
  },
  {
    name: "🏆 5v5 Turnuva Kaydı",
    titleTR: "🏆 Haftalık Ödüllü 5v5 Turnuva Kayıtları Açıldı!",
    titleEN: "🏆 Weekly Prize 5v5 Tournament Registration Open!",
    contentTR: "Bu hafta sonu düzenlenecek olan 5v5 özel ödüllü turnuvamızın kayıtları başladı! Kayıt olmak için Discord adresimizdeki #turnuva-kayit kanalını ziyaret edebilirsiniz. Herkese başarılar!",
    contentEN: "Registration for this weekend's 5v5 custom prize tournament is now open! Check out #tournament-reg on our Discord to sign up. Good luck to everyone!",
    badgeTR: "TURNUVA",
    badgeEN: "TOURNAMENT",
    importance: "high",
  },
  {
    name: "🎬 Yeni YouTube Videosu",
    titleTR: "🎬 Yeni YouTube Videosu Yayında!",
    titleEN: "🎬 New YouTube Video is Live!",
    contentTR: "Son maçtaki en komik anlar ve efsane vuruşları derlediğim yeni video YouTube kanalımızda yayında! Hemen izle, beğenip yorum yapmayı unutma dostum!",
    contentEN: "My latest video compiling funniest moments and insane clips is now live on our YouTube channel! Watch it now, and don't forget to like and comment!",
    badgeTR: "VİDEO",
    badgeEN: "VIDEO",
    importance: "medium",
  },
  {
    name: "⚙️ Ayar Güncellemesi",
    titleTR: "⚙️ En Güncel Oyun & Grafik Ayarlarım!",
    titleEN: "⚙️ My Latest Game & Graphic Settings!",
    contentTR: "Sizlerden gelen yoğun istek üzerine CS2 oyun içi hassasiyet (sensitivity), DPI, video ayarları ve başlatma seçeneklerimi güncelledim. 'Ayarlar' sayfasından hepsine ulaşabilirsiniz!",
    contentEN: "Due to high demand, I've updated my CS2 sensitivity, DPI, video settings, and launch options. Check them out on our 'Settings' page!",
    badgeTR: "GÜNCELLEME",
    badgeEN: "UPDATE",
    importance: "medium",
  },
  {
    name: "💬 Discord Sunucusu",
    titleTR: "💬 Discord Topluluğumuza Katılın!",
    titleEN: "💬 Join Our Discord Community!",
    contentTR: "Yayın dışı sohbetler, oyun arkadaşı bulma ve tüm çekilişler/etkinlikler için Discord sunucumuza davetlisiniz! Ailemizin bir parçası olmak için sosyal bağlantılardan Discord butonuna tıkla!",
    contentEN: "You are invited to join our Discord server for off-stream chats, finding teammates, and all giveaways/events! Click the Discord button in social links to join!",
    badgeTR: "TOPLULUK",
    badgeEN: "COMMUNITY",
    importance: "low",
  }
];

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  isStreamLive: boolean;
  setIsStreamLive: (live: boolean) => void;
  currentUser: UserAccount | null;
  cs2Settings: CS2SettingsData;
  onSaveCs2Settings: (updated: CS2SettingsData) => void;
  crosshairs: CrosshairItem[];
  onSaveCrosshairs: (updated: CrosshairItem[]) => void;
  streamCategory: string;
  onSaveStreamCategory: (val: string) => void;
  streamTitle: string;
  onSaveStreamTitle: (val: string) => void;
  streamViewers: string;
  onSaveStreamViewers: (val: string) => void;
  playlists: PlaylistItem[];
  onSavePlaylists: (updated: PlaylistItem[]) => void;
  systemSpecs: SpecItem[];
  onSaveSystemSpecs: (updated: SpecItem[]) => void;
  announcements: Announcement[];
  onSaveAnnouncements: (updated: Announcement[]) => void;
  isRegistrationDisabled?: boolean;
  onToggleRegistration?: (disabled: boolean) => void;
  visitorCount?: number;
  onSaveVisitorCount?: (count: number) => void;
}

interface MessageInboxItem {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop", // Default Man
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", // Woman
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop", // Neon Abstract
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop"  // Gamepad/Setup
];

const compressCrosshairIcon = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 120;
        const MAX_HEIGHT = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/webp", 0.7) || canvas.toDataURL("image/png");
          resolve(dataUrl);
        } else {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => reject(new Error("Görsel yüklenemedi."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });
};

export default function AdminPanelModal({ 
  isOpen, 
  onClose, 
  profile, 
  onSaveProfile, 
  isStreamLive, 
  setIsStreamLive,
  currentUser,
  cs2Settings,
  onSaveCs2Settings,
  crosshairs,
  onSaveCrosshairs,
  streamCategory,
  onSaveStreamCategory,
  streamTitle,
  onSaveStreamTitle,
  streamViewers,
  onSaveStreamViewers,
  playlists,
  onSavePlaylists,
  systemSpecs,
  onSaveSystemSpecs,
  announcements,
  onSaveAnnouncements,
  isRegistrationDisabled = false,
  onToggleRegistration,
  visitorCount = 0,
  onSaveVisitorCount
}: AdminPanelModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "profile" | "settings" | "inbox" | "users" | "stream" | "crosshairs" | "playlists" | "specs" | "announcements">("dashboard");
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [settingsForm, setSettingsForm] = useState<CS2SettingsData>({ ...cs2Settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Scroll Position Retention & Fluid Transition Refs
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const tabScrollPositions = React.useRef<Record<string, number>>({});

  const handleTabChange = (newTab: typeof activeSubTab) => {
    if (scrollContainerRef.current) {
      tabScrollPositions.current[activeSubTab] = scrollContainerRef.current.scrollTop;
    }
    setSavedSuccess(false);
    setActiveSubTab(newTab);
    
    // Smooth micro-transition animation frame delay
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = tabScrollPositions.current[newTab] || 0;
      }
    });
  };

  // Elegant Toast System States
  interface ToastMessage {
    id: string;
    message: string;
    type: "success" | "error" | "info";
  }
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        version: "1.0",
        backupDate: new Date().toISOString(),
        profile,
        cs2Settings,
        crosshairs,
        playlists,
        systemSpecs,
        announcements,
        isRegistrationDisabled
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `weew_portal_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("Tüm site ayarları başarıyla JSON olarak dışa aktarıldı!", "success");
    } catch (error) {
      showToast("Yedek dosyası oluşturulurken bir hata oluştu!", "error");
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = event.target?.result as string;
        const backupData = JSON.parse(jsonContent);

        if (!backupData || typeof backupData !== "object") {
          showToast("Geçersiz yedek dosyası formatı!", "error");
          return;
        }

        let importCount = 0;

        if (backupData.profile) {
          onSaveProfile(backupData.profile);
          setFormData(backupData.profile);
          importCount++;
        }
        if (backupData.cs2Settings) {
          onSaveCs2Settings(backupData.cs2Settings);
          setSettingsForm(backupData.cs2Settings);
          importCount++;
        }
        if (backupData.crosshairs && Array.isArray(backupData.crosshairs)) {
          onSaveCrosshairs(backupData.crosshairs);
          importCount++;
        }
        if (backupData.playlists && Array.isArray(backupData.playlists)) {
          onSavePlaylists(backupData.playlists);
          importCount++;
        }
        if (backupData.systemSpecs && Array.isArray(backupData.systemSpecs)) {
          onSaveSystemSpecs(backupData.systemSpecs);
          importCount++;
        }
        if (backupData.announcements && Array.isArray(backupData.announcements)) {
          onSaveAnnouncements(backupData.announcements);
          importCount++;
        }
        if (backupData.isRegistrationDisabled !== undefined && onToggleRegistration) {
          onToggleRegistration(backupData.isRegistrationDisabled);
          importCount++;
        }

        if (importCount > 0) {
          showToast("Yedek başarıyla yüklendi! Tüm ayarlar anında güncellendi.", "success");
        } else {
          showToast("Yedek dosyasında içe aktarılacak uyumlu bir veri bulunamadı.", "error");
        }
      } catch (err) {
        showToast("Yedek dosyası okunurken veya ayrıştırılırken hata oluştu!", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Crosshair Management States
  const [editingCrosshair, setEditingCrosshair] = useState<CrosshairItem | null>(null);
  const [isAddingCrosshair, setIsAddingCrosshair] = useState(false);
  const [crosshairToDeleteId, setCrosshairToDeleteId] = useState<string | null>(null);
  const [crosshairForm, setCrosshairForm] = useState<Partial<CrosshairItem>>({
    name: "",
    code: "",
    type: "regular",
    color: "#ffffff",
    size: 2.5,
    gap: -2,
    thickness: 1.2,
    outline: true,
    group: "main",
    videoUrl: ""
  });

  // Playlist Management States
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistItem | null>(null);
  const [isAddingPlaylist, setIsAddingPlaylist] = useState(false);
  const [playlistToDeleteId, setPlaylistToDeleteId] = useState<string | null>(null);
  const [playlistForm, setPlaylistForm] = useState<Partial<PlaylistItem>>({
    title: "",
    videoCount: 0,
    thumbnail: "",
    url: ""
  });

  // System Specs Management States
  const [editingSpec, setEditingSpec] = useState<SpecItem | null>(null);
  const [editingSpecIndex, setEditingSpecIndex] = useState<number | null>(null);
  const [isAddingSpec, setIsAddingSpec] = useState(false);
  const [specToDeleteIndex, setSpecToDeleteIndex] = useState<number | null>(null);
  const [specForm, setSpecForm] = useState<Partial<SpecItem>>({
    category: "",
    name: "",
    value: ""
  });

  // Announcement Management States
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [announcementToDeleteId, setAnnouncementToDeleteId] = useState<string | null>(null);
  const [announcementForm, setAnnouncementForm] = useState<Partial<Announcement>>({
    titleTR: "",
    titleEN: "",
    contentTR: "",
    contentEN: "",
    badgeTR: "",
    badgeEN: "",
    importance: "medium",
    active: true
  });

  // Loaded dynamically
  const [messages, setMessages] = useState<MessageInboxItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);

  // Drag and Drop Upload States
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WEBP vb.).");
      return;
    }
    // Limit file size to 3MB for localStorage base64 safety
    if (file.size > 3 * 1024 * 1024) {
      setUploadError("Görsel boyutu çok büyük (Maksimum 3MB). Telefon kamerası fotoğrafları için ekran görüntüsü alıp yüklemeyi deneyebilirsiniz.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleChange("profilePhoto", base64String);
    };
    reader.onerror = () => {
      setUploadError("Dosya okunurken bir hata oluştu.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      loadRegisteredUsers();
      setSettingsForm({ ...cs2Settings });
    }
  }, [isOpen, cs2Settings]);

  const loadMessages = () => {
    const raw = localStorage.getItem("weew_messages");
    if (raw) {
      try {
        setMessages(JSON.parse(raw));
      } catch (e) {
        setMessages([]);
      }
    } else {
      // Seed a couple of friendly demo messages if inbox is completely empty
      const demoMessages: MessageInboxItem[] = [
        {
          id: "msg-1",
          name: "Metehan Yıldız",
          email: "mete@gmail.com",
          message: "Yeni yayın planı ve CS2 turnuvası ne zaman başlıyor? Discord üzerinden de sordum, heyecanla bekliyoruz!",
          date: new Date(Date.now() - 3600000 * 4).toLocaleString("tr-TR")
        },
        {
          id: "msg-2",
          name: "Melis Kaya",
          email: "melis.kaya@outlook.com",
          message: "Harika bir web sitesi tasarımı olmuş! Sponsorluk ve ekipman iş birliği için detaylı bir e-posta gönderdim, bakabilirsen sevinirim.",
          date: new Date(Date.now() - 3600000 * 24).toLocaleString("tr-TR")
        }
      ];
      localStorage.setItem("weew_messages", JSON.stringify(demoMessages));
      setMessages(demoMessages);
    }
  };

  const loadRegisteredUsers = () => {
    const raw = localStorage.getItem("weew_registered_users");
    let usersList: UserAccount[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        usersList = Object.entries(parsed).map(([email, info]: any) => ({
          email,
          name: info.name,
          role: info.role,
          createdAt: info.createdAt || new Date().toISOString()
        }));
      } catch (e) {
        // ignore
      }
    }

    // Ensure our super admin is always represented on the list
    const superAdminEmail = "iremsaltanat002001@gmail.com";
    if (!usersList.some(u => u.email === superAdminEmail)) {
      usersList.unshift({
        email: superAdminEmail,
        name: "İrem Saltanat",
        role: "admin",
        createdAt: new Date().toISOString()
      });
    }

    setRegisteredUsers(usersList);
  };

  const handleGenerateMockMessage = () => {
    const names = ["Berkay Öztürk", "Selin Demir", "Alperen Şen", "Görkem Yılmaz", "İlayda Çelik"];
    const emails = ["berkay@gmail.com", "selin@hotmail.com", "alperen@outlook.com", "gorkem@gmail.com", "ilayda@outlook.com"];
    const textOptions = [
      "Kullandığın crosshair gerçekten harika, bütün maçlarda bunu kullanmaya başladım!",
      "Yayın kaliten inanılmaz derecede akıcı, hangi OBS ayarlarını kullanıyorsun?",
      "Bir sonraki yayında topluluk maçı veya izleyici turnuvası yapacak mısın?",
      "Yeni kurduğun sistem parçaları hakkında detaylı bir inceleme videosu gelse çok güzel olur.",
      "Selam, sponsorluk detayları hakkında görüşmek isteriz. Discord adresinden istek attım."
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    const newMsg: MessageInboxItem = {
      id: `mock-${Date.now()}`,
      name: names[randomIndex],
      email: emails[randomIndex],
      message: textOptions[randomIndex],
      date: new Date().toLocaleString("tr-TR")
    };
    
    const updatedMessages = [newMsg, ...messages];
    setMessages(updatedMessages);
    localStorage.setItem("weew_messages", JSON.stringify(updatedMessages));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    showToast("Gelen kutusuna yeni bir test mesajı başarıyla eklendi!", "success");
  };

  if (!isOpen) return null;

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
    showToast("Profil bilgileri başarıyla kaydedildi!", "success");
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    localStorage.setItem("weew_messages", JSON.stringify(updated));
    showToast("Mesaj başarıyla silindi!", "success");
  };

  const handleDeleteUser = (emailToDelete: string) => {
    if (emailToDelete === "iremsaltanat002001@gmail.com") {
      showToast("Kurucu admin hesabı silinemez!", "error");
      return;
    }

    const raw = localStorage.getItem("weew_registered_users");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        delete parsed[emailToDelete];
        localStorage.setItem("weew_registered_users", JSON.stringify(parsed));
        loadRegisteredUsers();
        showToast("Kayıtlı üye başarıyla silindi!", "success");
      } catch (e) {
        showToast("Üye silinirken bir hata oluştu.", "error");
      }
    }
  };

  // Crosshair actions
  const handleAddCrosshairClick = () => {
    setCrosshairForm({
      name: "",
      code: "",
      type: "regular",
      color: "#ffffff",
      size: 2.5,
      gap: -2,
      thickness: 1.2,
      outline: true,
      group: "main",
      videoUrl: ""
    });
    setIsAddingCrosshair(true);
    setEditingCrosshair(null);
    setSavedSuccess(false);
  };

  const handleEditCrosshairClick = (item: CrosshairItem) => {
    setCrosshairForm({ ...item });
    setEditingCrosshair(item);
    setIsAddingCrosshair(false);
    setSavedSuccess(false);
  };

  const handleDeleteCrosshair = (id: string) => {
    setCrosshairToDeleteId(id);
  };

  const confirmDeleteCrosshair = () => {
    if (crosshairToDeleteId) {
      const updated = crosshairs.filter(item => item.id !== crosshairToDeleteId);
      onSaveCrosshairs(updated);
      setCrosshairToDeleteId(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      showToast("Nişangah (crosshair) başarıyla silindi!", "success");
    }
  };

  const handleSaveCrosshairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crosshairForm.name || !crosshairForm.code) {
      showToast("Lütfen İsim ve Kod alanlarını doldurunuz!", "error");
      return;
    }

    const wasAdding = isAddingCrosshair;

    if (isAddingCrosshair) {
      const newItem: CrosshairItem = {
        id: "cross-" + Date.now(),
        name: crosshairForm.name || "",
        code: crosshairForm.code || "",
        type: (crosshairForm.type || "regular") as any,
        color: crosshairForm.color || "#ffffff",
        size: crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5,
        gap: crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2,
        thickness: crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2,
        outline: crosshairForm.outline ?? true,
        group: (crosshairForm.group || "main") as any,
        videoUrl: crosshairForm.videoUrl || "",
        customIcon: crosshairForm.customIcon
      };
      onSaveCrosshairs([...crosshairs, newItem]);
    } else if (editingCrosshair) {
      const updated = crosshairs.map(item => {
        if (item.id === editingCrosshair.id) {
          return {
            ...item,
            name: crosshairForm.name || "",
            code: crosshairForm.code || "",
            type: (crosshairForm.type || "regular") as any,
            color: crosshairForm.color || "#ffffff",
            size: crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5,
            gap: crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2,
            thickness: crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2,
            outline: crosshairForm.outline ?? true,
            group: (crosshairForm.group || "main") as any,
            videoUrl: crosshairForm.videoUrl || "",
            customIcon: crosshairForm.customIcon
          };
        }
        return item;
      });
      onSaveCrosshairs(updated);
    }

    setIsAddingCrosshair(false);
    setEditingCrosshair(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    showToast(
      wasAdding 
        ? "Yeni nişangah (crosshair) başarıyla eklendi!" 
        : "Nişangah (crosshair) ayarları başarıyla güncellendi!", 
      "success"
    );
  };

  const handleAddPlaylistClick = () => {
    setPlaylistForm({
      title: "",
      videoCount: 0,
      thumbnail: "",
      url: ""
    });
    setIsAddingPlaylist(true);
    setEditingPlaylist(null);
    setSavedSuccess(false);
  };

  const handleEditPlaylistClick = (item: PlaylistItem) => {
    setPlaylistForm({ ...item });
    setEditingPlaylist(item);
    setIsAddingPlaylist(false);
    setSavedSuccess(false);
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylistToDeleteId(id);
  };

  const confirmDeletePlaylist = () => {
    if (playlistToDeleteId) {
      const updated = playlists.filter(item => (item.id || item.title) !== playlistToDeleteId);
      onSavePlaylists(updated);
      setPlaylistToDeleteId(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      showToast("YouTube oynatma listesi başarıyla silindi!", "success");
    }
  };

  const handleSavePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistForm.title || !playlistForm.url) {
      showToast("Lütfen Başlık ve URL alanlarını doldurunuz!", "error");
      return;
    }

    const wasAdding = isAddingPlaylist;
    // Default thumbnail fallback if empty
    const thumbnailVal = playlistForm.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop";

    if (isAddingPlaylist) {
      const newItem: PlaylistItem = {
        id: "playlist-" + Date.now(),
        title: playlistForm.title || "",
        videoCount: playlistForm.videoCount !== undefined ? Number(playlistForm.videoCount) : 0,
        thumbnail: thumbnailVal,
        url: playlistForm.url || ""
      };
      onSavePlaylists([...playlists, newItem]);
    } else if (editingPlaylist) {
      const updated = playlists.map(item => {
        if ((item.id && item.id === editingPlaylist.id) || (!item.id && item.title === editingPlaylist.title)) {
          return {
            ...item,
            title: playlistForm.title || "",
            videoCount: playlistForm.videoCount !== undefined ? Number(playlistForm.videoCount) : 0,
            thumbnail: thumbnailVal,
            url: playlistForm.url || ""
          };
        }
        return item;
      });
      onSavePlaylists(updated);
    }

    setIsAddingPlaylist(false);
    setEditingPlaylist(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    showToast(
      wasAdding 
        ? "Yeni YouTube oynatma listesi başarıyla eklendi!" 
        : "YouTube oynatma listesi başarıyla güncellendi!", 
      "success"
    );
  };

  // ==========================================
  // System Specifications Management Handlers
  // ==========================================
  const handleEditSpecClick = (spec: SpecItem, index: number) => {
    setEditingSpec(spec);
    setEditingSpecIndex(index);
    setSpecForm({ ...spec });
    setIsAddingSpec(false);
  };

  const handleAddSpecClick = () => {
    setEditingSpec(null);
    setEditingSpecIndex(null);
    setSpecForm({
      category: "",
      name: "",
      value: ""
    });
    setIsAddingSpec(true);
  };

  const handleDeleteSpecClick = (index: number) => {
    setSpecToDeleteIndex(index);
  };

  const confirmDeleteSpec = () => {
    if (specToDeleteIndex !== null) {
      const updated = systemSpecs.filter((_, idx) => idx !== specToDeleteIndex);
      onSaveSystemSpecs(updated);
      setSpecToDeleteIndex(null);
      showToast("Donanım/ekipman bilgisi başarıyla silindi!", "success");
    }
  };

  const handleSaveSpecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specForm.category || !specForm.name) {
      showToast("Lütfen Kategori ve İsim alanlarını doldurunuz!", "error");
      return;
    }

    const wasAdding = isAddingSpec;
    const newSpec: SpecItem = {
      category: specForm.category,
      name: specForm.name,
      value: specForm.value || ""
    };

    if (isAddingSpec) {
      onSaveSystemSpecs([...systemSpecs, newSpec]);
    } else if (editingSpecIndex !== null) {
      const updated = [...systemSpecs];
      updated[editingSpecIndex] = newSpec;
      onSaveSystemSpecs(updated);
    }

    setIsAddingSpec(false);
    setEditingSpec(null);
    setEditingSpecIndex(null);
    showToast(
      wasAdding 
        ? "Yeni donanım/ekipman bilgisi başarıyla eklendi!" 
        : "Donanım/ekipman bilgisi başarıyla güncellendi!", 
      "success"
    );
  };

  // ==========================================
  // Announcement Management Handlers
  // ==========================================
  const handleEditAnnouncementClick = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setAnnouncementForm({ ...ann });
    setIsAddingAnnouncement(false);
  };

  const handleAddAnnouncementClick = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({
      titleTR: "",
      titleEN: "",
      contentTR: "",
      contentEN: "",
      badgeTR: "",
      badgeEN: "",
      importance: "medium",
      active: true
    });
    setIsAddingAnnouncement(true);
  };

  const handleDeleteAnnouncementClick = (id: string) => {
    setAnnouncementToDeleteId(id);
  };

  const confirmDeleteAnnouncement = () => {
    if (announcementToDeleteId) {
      const updated = announcements.filter((a) => a.id !== announcementToDeleteId);
      onSaveAnnouncements(updated);
      setAnnouncementToDeleteId(null);
      showToast("Duyuru başarıyla silindi!", "success");
    }
  };

  const handleSaveAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.titleTR || !announcementForm.contentTR) {
      showToast("Lütfen Türkçe Başlık ve Türkçe İçerik alanlarını doldurunuz!", "error");
      return;
    }

    const wasAdding = isAddingAnnouncement;
    const titleENVal = announcementForm.titleEN || announcementForm.titleTR;
    const contentENVal = announcementForm.contentEN || announcementForm.contentTR;

    const newAnn: Announcement = {
      id: editingAnnouncement?.id || "ann-" + Math.random().toString(36).substring(2, 9),
      titleTR: announcementForm.titleTR,
      titleEN: titleENVal,
      contentTR: announcementForm.contentTR,
      contentEN: contentENVal,
      date: editingAnnouncement?.date || new Date().toISOString().split("T")[0],
      badgeTR: announcementForm.badgeTR || "",
      badgeEN: announcementForm.badgeEN || announcementForm.badgeTR || "",
      importance: announcementForm.importance || "medium",
      active: announcementForm.active ?? true
    };

    if (isAddingAnnouncement) {
      onSaveAnnouncements([newAnn, ...announcements]);
    } else {
      const updated = announcements.map((a) => (a.id === newAnn.id ? newAnn : a));
      onSaveAnnouncements(updated);
    }

    setIsAddingAnnouncement(false);
    setEditingAnnouncement(null);
    showToast(
      wasAdding 
        ? "Yeni duyuru başarıyla yayınlandı!" 
        : "Duyuru başarıyla güncellendi!", 
      "success"
    );
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Main Admin Dashboard Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        className="relative w-full max-w-4xl rounded-3xl border border-purple-500/10 bg-[#0c0d16] shadow-2xl z-10 flex flex-col overflow-hidden max-h-[85vh] text-left"
      >
        
        {/* Top Sticky Header and Horizontal/Responsive Navigation Tabs Bar */}
        <div className="border-b border-white/5 bg-[#0f111c]/60 backdrop-blur-md px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="bg-purple-600/10 p-1.5 rounded-xl border border-purple-500/20">
                <Shield className="h-4.5 w-4.5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span>YÖNETİM PANELİ</span>
                  <span className="text-[9px] font-mono font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded uppercase tracking-widest">
                    Super Admin
                  </span>
                </h3>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5 hidden sm:block">
                  Hoş geldin, {currentUser?.name || "İrem Saltanat"}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="rounded-xl border border-white/5 p-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Kapat"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Main Tabs Horizontal Row - Scrollable on mobile, beautiful badges */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2">
            {[
              { id: "profile", label: "Profil", icon: User },
              { id: "stream", label: "Yayın", icon: Radio, isLive: isStreamLive },
              { id: "crosshairs", label: "Crosshair", icon: Target },
              { id: "playlists", label: "YouTube", icon: Youtube },
              { id: "settings", label: "Sistem Ayarları", icon: Settings2 },
              { id: "specs", label: "Donanım / Ekipman", icon: Sliders },
              { id: "announcements", label: "Duyuru Paneli", icon: Megaphone },
            ].map((tab) => {
              // Determine active state
              const isTabActive = (() => {
                if (tab.id === "profile") {
                  return ["dashboard", "profile", "inbox", "users"].includes(activeSubTab);
                }
                return activeSubTab === tab.id;
              })();

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "profile") {
                      handleTabChange("dashboard");
                    } else {
                      handleTabChange(tab.id as any);
                    }
                  }}
                  className={`flex items-center space-x-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer border ${
                    isTabActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.isLive && (
                    <span className="h-2 w-2 rounded-full bg-[#00e676] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Main Content Container */}
        <div ref={scrollContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="flex-1"
            >
            {/* Sub Tabs for Profil Category (Dashboard, Profile edit, Inbox, Registered users) */}
            {["dashboard", "profile", "inbox", "users"].includes(activeSubTab) && (
              <div className="flex items-center flex-wrap gap-1.5 mb-5 pb-4 border-b border-white/5">
                {[
                  { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
                  { id: "profile", label: "Profil Bilgileri", icon: Settings2 },
                  { id: "inbox", label: "Gelen Kutusu", icon: Mail, badge: messages.length },
                  { id: "users", label: "Kayıtlı Üyeler", icon: Users, badge: registeredUsers.length },
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => {
                      handleTabChange(subTab.id as any);
                    }}
                    className={`flex items-center space-x-1.5 sm:space-x-2 rounded-xl px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                      activeSubTab === subTab.id
                        ? "bg-purple-600/15 border border-purple-500/30 text-purple-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border-white/5 bg-[#0e0f1a]"
                    }`}
                  >
                    <subTab.icon className="h-3 w-3 shrink-0" />
                    <span>{subTab.label}</span>
                    {subTab.badge !== undefined && subTab.badge > 0 && (
                      <span className="bg-purple-600 text-white rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none">
                        {subTab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
              <h2 className="font-display text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
                {activeSubTab === "dashboard" && "Genel Bakış"}
                {activeSubTab === "profile" && "Site Profilini Düzenle"}
                {activeSubTab === "settings" && "Sistem & CS2 Oyun Ayarları"}
                {activeSubTab === "inbox" && `Gelen Mesaj Kutusu (${messages.length})`}
                {activeSubTab === "users" && `Kayıtlı Üye Listesi (${registeredUsers.length})`}
                {activeSubTab === "stream" && "Canlı Yayın & Simülasyon Kontrolü"}
                {activeSubTab === "crosshairs" && "Crosshair Kod Listesi & Galerisi"}
                {activeSubTab === "playlists" && "YouTube Oynatma Listesi Yönetimi"}
                {activeSubTab === "specs" && "Sistem Donanım & Ekipman Özellikleri Yönetimi"}
                {activeSubTab === "announcements" && "Duyuru Paneli Yönetimi"}
              </h2>
            </div>

            {/* Notification alert banner */}
            {savedSuccess && (
              <div className="mb-5 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-xs font-semibold">
                <Check className="h-4 w-4 shrink-0" />
                <span>Değişiklikler başarıyla kaydedildi!</span>
              </div>
            )}

            {/* Tab: Dashboard Overview */}
            {activeSubTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Widgets Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Stat 1: Stream */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#11121d] border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Yayın Durumu</span>
                      <Radio className={`h-4 w-4 ${isStreamLive ? "text-[#00e676] animate-pulse" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <span className="text-xl font-black text-white block">
                        {isStreamLive ? "CANLI" : "ÇEVRİMDIŞI"}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mt-1">
                        {isStreamLive ? `${Number(streamViewers).toLocaleString("tr-TR")} İZLEYİCİ` : "YAYIN YAPILMIYOR"}
                      </span>
                    </div>
                  </div>

                  {/* Stat 2: Messages */}
                  <div 
                    onClick={() => handleTabChange("inbox")} 
                    className="p-4 sm:p-5 rounded-2xl bg-[#11121d] border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Gelen Kutusu</span>
                      <Mail className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-xl font-black text-white block">
                        {messages.length}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mt-1 hover:text-blue-300 transition-colors">
                        MESAJLARA GİT →
                      </span>
                    </div>
                  </div>

                  {/* Stat 3: Registered Users */}
                  <div 
                    onClick={() => handleTabChange("users")} 
                    className="p-4 sm:p-5 rounded-2xl bg-[#11121d] border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-pink-500/5 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest">Kayıtlı Üyeler</span>
                      <Users className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <span className="text-xl font-black text-white block">
                        {registeredUsers.length}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mt-1 hover:text-pink-300 transition-colors">
                        ÜYELERİ YÖNET →
                      </span>
                    </div>
                  </div>

                  {/* Stat 4: Crosshairs */}
                  <div 
                    onClick={() => handleTabChange("crosshairs")} 
                    className="p-4 sm:p-5 rounded-2xl bg-[#11121d] border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-[#00e676]/5 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#00e676] uppercase tracking-widest">Crosshairler</span>
                      <Target className="h-4 w-4 text-[#00e676]" />
                    </div>
                    <div>
                      <span className="text-xl font-black text-white block">
                        {crosshairs.length}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mt-1 hover:text-[#00e676] transition-colors">
                        GALERİYİ DÜZENLE →
                      </span>
                    </div>
                  </div>

                  {/* Stat 5: Visitor Counter */}
                  <div 
                    onClick={() => {
                      const el = document.getElementById("visitor-counter-section");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="p-4 sm:p-5 rounded-2xl bg-[#11121d] border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 cursor-pointer col-span-2 md:col-span-1"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Tekil Ziyaretçi</span>
                      <Eye className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-xl font-black text-white block">
                        {visitorCount.toLocaleString("tr-TR")}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mt-1 hover:text-amber-300 transition-colors">
                        SAYACI YÖNET →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stream Simulator Controls Panel */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/20 to-indigo-950/20 border border-purple-500/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#00e676] animate-ping" />
                        <span className="text-[10px] font-mono font-bold text-[#00e676] uppercase tracking-widest">Hızlı Yayın Simülatörü</span>
                      </div>
                      <h3 className="font-display text-lg font-extrabold text-white uppercase tracking-wider">
                        KICK CANLI YAYIN DURUMUNUZU KONTROL EDİN
                      </h3>
                      <p className="text-xs text-gray-400 max-w-xl font-medium">
                        Ana sayfadaki canlı yayın simülasyonunu anlık başlatıp kapatın. Yayın aktifken kategori, izleyici sayısı ve başlık verileri canlı olarak güncellenir.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextLive = !isStreamLive;
                          setIsStreamLive(nextLive);
                          showToast(
                            nextLive 
                              ? "Yayın simülatörü başarıyla başlatıldı! Şu an CANLI (LIVE) yayındasınız." 
                              : "Yayın simülatörü durduruldu. Çevrimdışı (OFFLINE) moda geçildi.",
                            nextLive ? "success" : "info"
                          );
                        }}
                        className={`rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition duration-300 cursor-pointer ${
                          isStreamLive 
                            ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                            : "bg-[#00e676] hover:bg-[#00c853] text-black shadow-[0_0_15px_rgba(0,230,118,0.4)]"
                        }`}
                      >
                        {isStreamLive ? "YAYINI KAPAT (OFFLINE)" : "YAYINI BAŞLAT (LIVE)"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ziyaretçi Sayacı Kontrolü */}
                <div id="visitor-counter-section" className="p-6 rounded-3xl bg-[#11121d] border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold mb-1">
                        👁️ ZİYARETÇİ SAYACI YÖNETİMİ
                      </span>
                      <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                        Tekil Ziyaretçi Sayacı Ayarları
                      </h3>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xl">
                        Sitenize gelen tekil ziyaretçi sayısını simüle edin veya başlangıç sayısını değiştirin. Her yeni tarayıcı ziyaretinde bu sayaç otomatik olarak 1 artar.
                      </p>
                    </div>

                    {/* Quick increment buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onSaveVisitorCount) {
                            onSaveVisitorCount(visitorCount + 100);
                            showToast("Sayaca +100 tekil ziyaretçi eklendi!", "success");
                          }
                        }}
                        className="rounded-xl bg-[#221f1c] hover:bg-[#2d2822] border border-amber-500/10 hover:border-amber-500/25 px-3 py-2 text-[10px] font-bold text-amber-400 transition cursor-pointer"
                      >
                        +100 Ziyaretçi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSaveVisitorCount) {
                            onSaveVisitorCount(visitorCount + 1000);
                            showToast("Sayaca +1,000 tekil ziyaretçi eklendi!", "success");
                          }
                        }}
                        className="rounded-xl bg-[#221f1c] hover:bg-[#2d2822] border border-amber-500/10 hover:border-amber-500/25 px-3 py-2 text-[10px] font-bold text-amber-400 transition cursor-pointer"
                      >
                        +1,000 Ziyaretçi
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                    {/* Current counter display input */}
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">
                        Mevcut Sayaç Değeri (Tekil Ziyaretçiler)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={visitorCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (onSaveVisitorCount && !isNaN(val)) {
                              onSaveVisitorCount(val);
                            }
                          }}
                          placeholder="Örn: 2450"
                          className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (onSaveVisitorCount) {
                              onSaveVisitorCount(0);
                              showToast("Sayaç başarıyla sıfırlandı.", "info");
                            }
                          }}
                          className="rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/20 text-red-400 text-xs px-4 font-bold transition cursor-pointer"
                        >
                          Sıfırla
                        </button>
                      </div>
                    </div>

                    {/* Stats insight card */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col justify-center">
                      <div className="text-[10px] font-mono text-amber-400/80 uppercase font-bold tracking-widest mb-1">
                        Sistem Raporu
                      </div>
                      <div className="text-xs text-amber-200 font-semibold leading-normal">
                        Kayıtlı {registeredUsers.length} üyeye karşılık, {visitorCount} tekil ziyaret oranı tespit edildi.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Dynamic Simulation Metadata Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stream Customizer */}
                  <div className="p-6 rounded-3xl bg-[#11121d] border border-white/5 space-y-4">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">
                      YAYIN PARAMETRE AYARLARI
                    </span>

                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">
                          Yayın Başlığı (Simulated Stream Title)
                        </label>
                        <input
                          type="text"
                          value={streamTitle}
                          onChange={(e) => onSaveStreamTitle(e.target.value)}
                          placeholder="Örn: Rekabetçi Maçlar & Topluluk Yayını"
                          className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">
                            Kategori (Game/Category)
                          </label>
                          <input
                            type="text"
                            value={streamCategory}
                            onChange={(e) => onSaveStreamCategory(e.target.value)}
                            placeholder="Counter-Strike 2"
                            className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">
                            Simüle İzleyici Sayısı
                          </label>
                          <input
                            type="text"
                            value={streamViewers}
                            onChange={(e) => onSaveStreamViewers(e.target.value)}
                            placeholder="1400"
                            className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick System Utilities */}
                  <div className="p-6 rounded-3xl bg-[#11121d] border border-white/5 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold mb-3">
                        HIZLI SİSTEM ARAÇLARI
                      </span>
                      <p className="text-xs text-gray-400 mb-4 font-medium leading-relaxed">
                        Sitenizin düzgün çalıştığını test etmek için gelen kutusuna otomatik olarak rastgele kullanıcı mesajları ekleyebilir veya tüm bilgileri sıfırlayabilirsiniz.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleGenerateMockMessage}
                        className="w-full flex items-center justify-between rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-xs text-purple-300 font-bold px-4 py-3.5 transition group cursor-pointer"
                      >
                        <span className="uppercase tracking-wider">Test Mesajı Üret (Gelen Kutusu İçin)</span>
                        <MessageSquare className="h-4 w-4 text-purple-400 group-hover:scale-110 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Tüm mesajlaşma geçmişini ve kayıtları varsayılana sıfırlamak istiyor musunuz?")) {
                            localStorage.removeItem("weew_messages");
                            loadMessages();
                          }
                        }}
                        className="w-full flex items-center justify-between rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-xs text-red-400 font-bold px-4 py-3.5 transition group cursor-pointer"
                      >
                        <span className="uppercase tracking-wider">Mesaj Geçmişini Sıfırla</span>
                        <RefreshCw className="h-4 w-4 text-red-400 group-hover:rotate-180 transition duration-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Full-width Backup/Restore Card */}
                <div className="p-6 rounded-3xl bg-[#11121d] border border-white/5 space-y-4 mt-6">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold mb-1.5">
                      💾 PORTAL VERİ SİSTEMİ YEDEKLEME & RESTORE
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      TÜM SİTE AYARLARINI YEDEKLE VEYA GERİ YÜKLE
                    </h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                      Profil resminiz, sosyal medya linkleriniz, donanım özellikleriniz (specs), duyurularınız, nişangahlarınız (crosshairs), YouTube çalma listeleriniz ve tüm site ayarlarınızı tek tıkla JSON dosyası olarak bilgisayarınıza indirebilir, daha sonra tekrar yükleyerek anında sitenizi eski haline döndürebilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Export Action */}
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-xs font-black uppercase tracking-widest text-white py-4 transition shadow-[0_4px_15px_rgba(168,85,247,0.35)] cursor-pointer"
                    >
                      <Download className="h-4.5 w-4.5" />
                      <span>AYARLARI DIŞA AKTAR (EXPORT JSON)</span>
                    </button>

                    {/* Import Action */}
                    <div className="relative">
                      <input
                        id="backup-import-file-input"
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("backup-import-file-input")?.click()}
                        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-white py-4 transition cursor-pointer"
                      >
                        <Upload className="h-4.5 w-4.5 text-purple-400" />
                        <span>YEDEKTEN GERİ YÜKLE (IMPORT JSON)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Profile editor */}
            {activeSubTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-purple-400" />
                      Logo İsmi (Site Name)
                    </label>
                    <input
                      type="text"
                      value={formData.siteName}
                      onChange={(e) => handleChange("siteName", e.target.value)}
                      placeholder="Weew"
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Image className="h-3.5 w-3.5 text-purple-400" />
                      Profil Fotoğrafı URL
                    </label>
                    <input
                      type="text"
                      value={formData.profilePhoto}
                      onChange={(e) => handleChange("profilePhoto", e.target.value)}
                      placeholder="Resim URL'si girin"
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* File Upload Zone (Supports both Drag-and-Drop and smartphone selection) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-purple-400" />
                    Telefondan veya Bilgisayardan Fotoğraf Yükle
                  </span>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all duration-200 cursor-pointer relative ${
                      isDragging
                        ? "border-purple-500 bg-purple-500/10 scale-[1.01]"
                        : "border-white/10 bg-[#11121d] hover:border-purple-500/30 hover:bg-purple-500/5"
                    }`}
                    onClick={() => document.getElementById("mobile-file-upload-input")?.click()}
                  >
                    <input
                      id="mobile-file-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="h-10 w-10 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Upload className="h-5 w-5" />
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                          Dosya Seçmek İçin Dokunun veya Sürükleyin
                        </p>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                          PNG, JPG, WEBP • Maksimum 3MB
                        </p>
                      </div>
                    </div>

                    {/* Show small live preview inside the upload box */}
                    {formData.profilePhoto && formData.profilePhoto.startsWith("data:") && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00e676]" />
                        <span className="text-[9px] font-mono font-bold text-[#00e676] uppercase">Görsel Yüklendi</span>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* Profile Photo Presets */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider block">
                    Hazır Profil Fotoğrafı Seçenekleri
                  </span>
                  <div className="flex gap-4">
                    {AVATAR_PRESETS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChange("profilePhoto", url)}
                        className={`relative h-11 w-11 rounded-full overflow-hidden border-2 transition ${
                          formData.profilePhoto === url ? "border-purple-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                        {formData.profilePhoto === url && (
                          <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white font-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Biography details */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Hakkımda / Bio (Türkçe)
                    </label>
                    <textarea
                      value={formData.bioTR}
                      onChange={(e) => handleChange("bioTR", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      About Me / Bio (English)
                    </label>
                    <textarea
                      value={formData.bioEN}
                      onChange={(e) => handleChange("bioEN", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>

                {/* Social media inputs */}
                <div className="border-t border-white/5 pt-4 space-y-4">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                    Sosyal Medya Linkleri
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Kick */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-[#00e676] block uppercase tracking-wider">KICK KANALI</span>
                      <input
                        type="text"
                        value={formData.kickUsername}
                        onChange={(e) => handleChange("kickUsername", e.target.value)}
                        placeholder="Kullanıcı adı"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={formData.kickUrl}
                        onChange={(e) => handleChange("kickUrl", e.target.value)}
                        placeholder="Link"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* Instagram */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-[#e1306c] block uppercase tracking-wider">INSTAGRAM</span>
                      <input
                        type="text"
                        value={formData.instagramUsername}
                        onChange={(e) => handleChange("instagramUsername", e.target.value)}
                        placeholder="Kullanıcı adı"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={formData.instagramUrl}
                        onChange={(e) => handleChange("instagramUrl", e.target.value)}
                        placeholder="Link"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-red-500 block uppercase tracking-wider">YOUTUBE</span>
                      <input
                        type="text"
                        value={formData.youtubeUsername}
                        onChange={(e) => handleChange("youtubeUsername", e.target.value)}
                        placeholder="Kullanıcı adı"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={formData.youtubeUrl}
                        onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                        placeholder="Link"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* TikTok */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-cyan-400 block uppercase tracking-wider">TIKTOK</span>
                      <input
                        type="text"
                        value={formData.tiktokUsername}
                        onChange={(e) => handleChange("tiktokUsername", e.target.value)}
                        placeholder="Kullanıcı adı"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={formData.tiktokUrl}
                        onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                        placeholder="Link"
                        className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* Discord */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 sm:col-span-2">
                      <span className="text-[10px] font-bold text-indigo-400 block uppercase tracking-wider">DISCORD SUNUCUSU</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.discordUsername}
                          onChange={(e) => handleChange("discordUsername", e.target.value)}
                          placeholder="Etiket / İsim"
                          className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={formData.discordUrl}
                          onChange={(e) => handleChange("discordUrl", e.target.value)}
                          placeholder="Davet Linki"
                          className="w-full rounded-lg bg-[#0c0d16] border border-white/5 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 text-xs uppercase tracking-widest transition flex items-center gap-1.5 shadow-[0_4px_15px_rgba(168,85,247,0.3)] cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Ayarları Kaydet</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab: Game Settings Accordion form editor */}
            {activeSubTab === "settings" && (
              <form onSubmit={(e) => {
                e.preventDefault();
                onSaveCs2Settings(settingsForm);
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 1500);
                showToast("Sistem & CS2 oyun ayarları başarıyla kaydedildi!", "success");
              }} className="space-y-6">
                
                {/* Mouse Settings Category */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Smartphone className="h-4 w-4" />
                    MOUSE AYARLARI
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">DPI</label>
                      <input
                        type="text"
                        value={settingsForm.mouseDpi}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mouseDpi: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">SENSITIVITY (HASSASİYET)</label>
                      <input
                        type="text"
                        value={settingsForm.mouseSens}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mouseSens: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">POLLING RATE (RAPORLAMA HIZI)</label>
                      <input
                        type="text"
                        value={settingsForm.mousePolling}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mousePolling: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Viewmodel Settings Category */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Sliders className="h-4 w-4" />
                    VIEWMODEL AYARLARI
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">FOV</label>
                      <input
                        type="text"
                        value={settingsForm.viewmodelFov}
                        onChange={(e) => setSettingsForm({ ...settingsForm, viewmodelFov: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">OFFSET X</label>
                      <input
                        type="text"
                        value={settingsForm.viewmodelOffsetX}
                        onChange={(e) => setSettingsForm({ ...settingsForm, viewmodelOffsetX: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">OFFSET Y</label>
                      <input
                        type="text"
                        value={settingsForm.viewmodelOffsetY}
                        onChange={(e) => setSettingsForm({ ...settingsForm, viewmodelOffsetY: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">OFFSET Z</label>
                      <input
                        type="text"
                        value={settingsForm.viewmodelOffsetZ}
                        onChange={(e) => setSettingsForm({ ...settingsForm, viewmodelOffsetZ: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">PRESETPOS</label>
                      <input
                        type="text"
                        value={settingsForm.viewmodelPresetpos}
                        onChange={(e) => setSettingsForm({ ...settingsForm, viewmodelPresetpos: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">KONSOL KODLARI (COPYABLE CONSOLE CODE)</label>
                    <textarea
                      value={settingsForm.viewmodelConsoleCode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, viewmodelConsoleCode: e.target.value })}
                      rows={2}
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-pink-500 resize-none"
                    />
                  </div>
                </div>

                {/* HUD Settings Category */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Info className="h-4 w-4" />
                    HUD AYARLARI
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CL_HUD_COLOR</label>
                      <input
                        type="text"
                        value={settingsForm.hudColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hudColor: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">YORUM / NOT (COMMENT)</label>
                      <input
                        type="text"
                        value={settingsForm.hudComment}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hudComment: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Graphics Settings Category */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Tv className="h-4 w-4" />
                    GÖRÜNTÜ AYARLARI
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">GÖRÜNTÜ MODU</label>
                      <input
                        type="text"
                        value={settingsForm.videoMode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, videoMode: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">ORAN</label>
                      <input
                        type="text"
                        value={settingsForm.videoAspect}
                        onChange={(e) => setSettingsForm({ ...settingsForm, videoAspect: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">ÇÖZÜNÜRLÜK</label>
                      <input
                        type="text"
                        value={settingsForm.videoResolution}
                        onChange={(e) => setSettingsForm({ ...settingsForm, videoResolution: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">HZ</label>
                      <input
                        type="text"
                        value={settingsForm.videoRefresh}
                        onChange={(e) => setSettingsForm({ ...settingsForm, videoRefresh: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">PARLAKLIK</label>
                      <input
                        type="text"
                        value={settingsForm.videoBrightness}
                        onChange={(e) => setSettingsForm({ ...settingsForm, videoBrightness: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">GÖRÜNTÜ NOTU (COMMENT / VIDEO WARNING)</label>
                    <input
                      type="text"
                      value={settingsForm.videoComment}
                      onChange={(e) => setSettingsForm({ ...settingsForm, videoComment: e.target.value })}
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Crosshair Settings Category */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Sliders className="h-4 w-4" />
                    CROSSHAIR AYARLARI
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CROSSHAİR İSMİ / BAŞLIK</label>
                      <input
                        type="text"
                        value={settingsForm.crosshairName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, crosshairName: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">YORUM / NOT (COMMENT)</label>
                      <input
                        type="text"
                        value={settingsForm.crosshairComment}
                        onChange={(e) => setSettingsForm({ ...settingsForm, crosshairComment: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CROSSHAİR KODU (SHARE CODE)</label>
                    <input
                      type="text"
                      value={settingsForm.crosshairCode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, crosshairCode: e.target.value })}
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Real-time Crosshair Preview Box */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase">// CANLI NİŞANGAH ÖNİZLEMESİ</span>
                    <div className="h-28 w-28 rounded-xl bg-[#090a12] border border-white/10 flex items-center justify-center relative shadow-inner overflow-hidden">
                      {/* Grid background representation to make it look like a real CS2 crosshair screen */}
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                      
                      {/* Dynamic Preview */}
                      <div className="relative scale-125 pointer-events-none flex items-center justify-center">
                        {(() => {
                          const itemColor = settingsForm.crosshairColor || "#ffffff";
                          const itemType = settingsForm.crosshairType || "small";
                          const itemSize = settingsForm.crosshairSize !== undefined ? Number(settingsForm.crosshairSize) : 3;
                          const itemThickness = settingsForm.crosshairThickness !== undefined ? Number(settingsForm.crosshairThickness) : 1.5;
                          const itemGap = settingsForm.crosshairGap !== undefined ? Number(settingsForm.crosshairGap) : -2;
                          const itemOutline = settingsForm.crosshairOutline !== undefined ? settingsForm.crosshairOutline : true;
                          const hasDot = itemType === "dot" || itemType === "dot-cross" || settingsForm.crosshairDot === true;
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
                  </div>

                  {/* Form fields in a layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    {/* Size and Thickness sliders */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Boyut ({settingsForm.crosshairSize || "3"})</label>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="10"
                          step="0.5"
                          value={settingsForm.crosshairSize || "3"}
                          onChange={(e) => setSettingsForm({ ...settingsForm, crosshairSize: e.target.value })}
                          className="w-full accent-emerald-500 h-1 bg-[#131522] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Kalınlık ({settingsForm.crosshairThickness || "1.5"})</label>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="6"
                          step="0.5"
                          value={settingsForm.crosshairThickness || "1.5"}
                          onChange={(e) => setSettingsForm({ ...settingsForm, crosshairThickness: e.target.value })}
                          className="w-full accent-emerald-500 h-1 bg-[#131522] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Boşluk ({settingsForm.crosshairGap || "-2"})</label>
                        </div>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          step="0.5"
                          value={settingsForm.crosshairGap || "-2"}
                          onChange={(e) => setSettingsForm({ ...settingsForm, crosshairGap: e.target.value })}
                          className="w-full accent-emerald-500 h-1 bg-[#131522] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Checkboxes and Type / Color dropdown */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Nişangah Tipi</label>
                        <select
                          value={settingsForm.crosshairType || "small"}
                          onChange={(e) => setSettingsForm({ ...settingsForm, crosshairType: e.target.value })}
                          className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="small">Küçük (Small)</option>
                          <option value="regular">Normal (Regular)</option>
                          <option value="large">Büyük (Large)</option>
                          <option value="thick">Kalın (Thick)</option>
                          <option value="dot">Nokta (Dot)</option>
                          <option value="plus">Artı (Plus)</option>
                          <option value="dot-cross">Nokta ve Artı</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Renk (Hex)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={settingsForm.crosshairColor || "#ffffff"}
                            onChange={(e) => setSettingsForm({ ...settingsForm, crosshairColor: e.target.value })}
                            className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                            placeholder="#ffffff"
                          />
                          <input
                            type="color"
                            value={settingsForm.crosshairColor?.startsWith("#") ? settingsForm.crosshairColor : "#ffffff"}
                            onChange={(e) => setSettingsForm({ ...settingsForm, crosshairColor: e.target.value })}
                            className="w-8 h-7 bg-transparent border-0 rounded cursor-pointer self-center"
                          />
                        </div>
                        {/* Preset colors */}
                        <div className="flex gap-1.5 pt-1">
                          {["#00ff33", "#00ffff", "#0066ff", "#ff0000", "#ffff00", "#ffffff"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, crosshairColor: color })}
                              style={{ backgroundColor: color }}
                              className="w-4 h-4 rounded-full border border-black/50 hover:scale-110 active:scale-95 transition"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-medium select-none">
                          <input
                            type="checkbox"
                            checked={settingsForm.crosshairOutline !== false}
                            onChange={(e) => setSettingsForm({ ...settingsForm, crosshairOutline: e.target.checked })}
                            className="rounded bg-[#131522] border-white/5 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                          />
                          <span>Dış Çerçeve (Outline)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-medium select-none">
                          <input
                            type="checkbox"
                            checked={settingsForm.crosshairDot === true}
                            onChange={(e) => setSettingsForm({ ...settingsForm, crosshairDot: e.target.checked })}
                            className="rounded bg-[#131522] border-white/5 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                          />
                          <span>Merkez Nokta (Dot)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radar Settings Category */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Sliders className="h-4 w-4" />
                    RADAR AYARLARI
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CL_HUD_RADAR_SCALE</label>
                      <input
                        type="text"
                        value={settingsForm.radarHudScale}
                        onChange={(e) => setSettingsForm({ ...settingsForm, radarHudScale: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CL_RADAR_SCALE</label>
                      <input
                        type="text"
                        value={settingsForm.radarScale}
                        onChange={(e) => setSettingsForm({ ...settingsForm, radarScale: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CL_RADAR_ROTATE</label>
                      <input
                        type="text"
                        value={settingsForm.radarRotate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, radarRotate: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CL_RADAR_ICON_SCALE_MIN</label>
                      <input
                        type="text"
                        value={settingsForm.radarIconScaleMin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, radarIconScaleMin: e.target.value })}
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">KONSOL KODLARI (RADAR CONSOLE CODE)</label>
                    <textarea
                      value={settingsForm.radarConsoleCode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, radarConsoleCode: e.target.value })}
                      rows={2}
                      className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>

                {/* Advanced: Settings YouTube Video Link */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#a855f7]/5 border border-purple-500/10 space-y-4">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Play className="h-4 w-4" />
                    AYARLAR VİDEOSU (YOUTUBE EMBED URL)
                  </span>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">YOUTUBE VİDEO URL VEYA ID</label>
                    <input
                      type="text"
                      value={settingsForm.youtubeVideoUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtubeVideoUrl: e.target.value })}
                      placeholder="Örn. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full rounded-xl bg-[#131522] border border-purple-500/20 px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wide block pt-1 leading-normal text-gray-400">
                      // Ayarlar sayfasındaki smartphone içinde oynatılacak videonun adresi. Boş bırakırsanız mockup görseli görüntülenir.
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 text-xs uppercase tracking-widest transition flex items-center gap-1.5 shadow-[0_4px_15px_rgba(168,85,247,0.3)] cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Ayarları Kaydet</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab: Message Inbox */}
            {activeSubTab === "inbox" && (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 border border-white/5 rounded-3xl flex flex-col items-center">
                    <MessageSquare className="h-10 w-10 text-gray-500 mb-3" />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Gelen kutusu boş</p>
                    <p className="text-xs text-gray-500 mt-1">İletişim formundan gönderilen mesajlar burada listelenir.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/5 relative group hover:border-purple-500/30 transition"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                          <div>
                            <span className="text-sm font-extrabold text-white uppercase tracking-tight block">
                              {msg.name}
                            </span>
                            <span className="text-xs text-purple-400 font-mono">
                              {msg.email}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold uppercase shrink-0">
                            {msg.date}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
                          {msg.message}
                        </p>

                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="absolute bottom-4 right-4 h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition border border-red-500/20"
                          title="Mesajı Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Users list */}
            {activeSubTab === "users" && (
              <div className="space-y-4">
                {/* Registration Control Switcher card */}
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span>🛡️ Kayıt Olma Özelliğini Kapat/Aç</span>
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-normal mt-0.5">
                        Ziyaretçilerin yeni üyelik oluşturmasını devre dışı bırakabilir veya aktifleştirebilirsiniz.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onToggleRegistration) {
                          onToggleRegistration(!isRegistrationDisabled);
                          showToast(
                            !isRegistrationDisabled 
                              ? "Yeni kayıt olma özelliği başarıyla KAPATILDI!" 
                              : "Yeni kayıt olma özelliği başarıyla AÇILDI!", 
                            "info"
                          );
                        }
                      }}
                      className={`rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition shrink-0 cursor-pointer ${
                        isRegistrationDisabled 
                          ? "bg-[#00e676] hover:bg-[#00c853] text-black shadow-[0_0_12px_rgba(0,230,118,0.3)]" 
                          : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_12px_rgba(220,38,38,0.3)]"
                      }`}
                    >
                      {isRegistrationDisabled ? "KAYITLARI AÇ (ENABLE)" : "KAYITLARI KAPAT (DISABLE)"}
                    </button>
                  </div>
                  <div className="text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 pt-1 border-t border-white/5">
                    <span>Mevcut Durum:</span>
                    {isRegistrationDisabled ? (
                      <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded animate-pulse">
                        🔴 Yeni Kayıtlar Devre Dışı (Closed)
                      </span>
                    ) : (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        🟢 Kayıtlar Herkese Açık (Open)
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-[11px] text-purple-300 leading-normal font-medium uppercase tracking-wide">
                  ⚠️ <span className="font-extrabold">Kurucu Hakları Korumalıdır:</span> iremsaltanat002001@gmail.com e-posta adresine ait kurucu adminlik statüsü sistem tarafından kilitlenmiştir ve hiçbir koşulda kaldırılamaz.
                </div>

                <div className="rounded-3xl border border-white/5 overflow-hidden bg-black/20">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                        <th className="p-4">Kullanıcı Adı</th>
                        <th className="p-4">E-posta</th>
                        <th className="p-4">Rol / Yetki</th>
                        <th className="p-4 text-right">Eylemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {registeredUsers.map((u) => {
                        const isPrimaryAdmin = u.email === "iremsaltanat002001@gmail.com";
                        return (
                          <tr key={u.email} className="hover:bg-white/5 transition">
                            <td className="p-4 text-white uppercase">{u.name}</td>
                            <td className="p-4 text-purple-400 font-mono text-[11px]">{u.email}</td>
                            <td className="p-4">
                              {isPrimaryAdmin ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                                  <Award className="h-3 w-3" />
                                  <span>KURUCU ADMIN</span>
                                </span>
                              ) : u.role === "admin" ? (
                                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                                  ADMIN
                                </span>
                              ) : (
                                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-gray-400">
                                  ÜYE / İZLEYİCİ
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              {isPrimaryAdmin ? (
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest italic">Kilitli</span>
                              ) : (
                                <button
                                  onClick={() => handleDeleteUser(u.email)}
                                  className="h-7 w-7 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white inline-flex items-center justify-center transition border border-red-500/20"
                                  title="Üyeliği Kaldır"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Stream manager */}
            {activeSubTab === "stream" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-1">
                      KICK YAYIN DURUMU
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      Ana sayfadaki canlı yayın simülasyonunu ve göstergeleri anlık kontrol edin.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsStreamLive(!isStreamLive)}
                    className={`rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition duration-300 cursor-pointer ${
                      isStreamLive 
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                        : "bg-[#00e676] hover:bg-[#00c853] text-black shadow-[0_0_15px_rgba(0,230,118,0.4)]"
                    }`}
                  >
                    {isStreamLive ? "YAYINI KAPAT (OFFLINE YAP)" : "YAYINI BAŞLAT (LIVE YAP)"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Interactive Customizer */}
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">YAYIN PARAMETRELERİNİ ÖZELLEŞTİR</span>
                    
                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase block">YAYIN BAŞLIĞI</label>
                        <input
                          type="text"
                          value={streamTitle}
                          onChange={(e) => onSaveStreamTitle(e.target.value)}
                          placeholder="Örn: Rekabetçi Maçlar & Topluluk Yayını"
                          className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase block">KATEGORİ / OYUN</label>
                          <input
                            type="text"
                            value={streamCategory}
                            onChange={(e) => onSaveStreamCategory(e.target.value)}
                            placeholder="Counter-Strike 2"
                            className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase block">İZLEYİCİ SAYISI</label>
                          <input
                            type="text"
                            value={streamViewers}
                            onChange={(e) => onSaveStreamViewers(e.target.value)}
                            placeholder="1400"
                            className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics preview */}
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">ANLIK GÖSTERGE METRİKLERİ</span>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-[#0c0d16] p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mb-1">İZLEYİCİ</span>
                        <span className="text-base text-white font-black">
                          {isStreamLive ? Number(streamViewers).toLocaleString("tr-TR") : "0"}
                        </span>
                      </div>
                      <div className="bg-[#0c0d16] p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mb-1">TAKİPÇİ</span>
                        <span className="text-base text-white font-black">23,450</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-purple-300 font-semibold leading-normal">
                      💡 Yayın parametrelerindeki tüm değişiklikler anında kaydedilir ve ana sayfadaki video oynatıcısında canlı olarak güncellenir.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Crosshairs list */}
            {activeSubTab === "crosshairs" && (
              <div className="space-y-6">
                {savedSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center space-x-2 animate-pulse">
                    <Check className="h-4 w-4" />
                    <span>Crosshair listesi güncellendi ve kaydedildi!</span>
                  </div>
                )}

                {/* Adding or Editing Form */}
                {(isAddingCrosshair || editingCrosshair) ? (
                  <form onSubmit={handleSaveCrosshairSubmit} className="space-y-6 bg-white/5 border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-purple-400" />
                        <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                          {isAddingCrosshair ? "YENİ CROSSHAİR EKLE" : "CROSSHAİR DÜZENLE"}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsAddingCrosshair(false); setEditingCrosshair(null); }}
                        className="text-gray-400 hover:text-white text-xs font-bold uppercase"
                      >
                        İptal Et
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left: inputs */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5">Crosshair İsmi</label>
                          <input
                            type="text"
                            required
                            placeholder="Örn: Beyaz Küçük Cross"
                            value={crosshairForm.name || ""}
                            onChange={(e) => setCrosshairForm({ ...crosshairForm, name: e.target.value })}
                            className="w-full bg-[#0c0d16] text-sm text-white font-bold p-3 rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5">Crosshair Kodu (Paylaşım Kodu)</label>
                          <input
                            type="text"
                            required
                            placeholder="Örn: CSGO-szhkk-FyTEc-rXaqy-yBozL-4J3ED"
                            value={crosshairForm.code || ""}
                            onChange={(e) => setCrosshairForm({ ...crosshairForm, code: e.target.value })}
                            className="w-full bg-[#0c0d16] text-sm text-white font-mono p-3 rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5">Şekil / Tip</label>
                            <select
                              value={crosshairForm.type || "regular"}
                              onChange={(e) => setCrosshairForm({ ...crosshairForm, type: e.target.value as any })}
                              className="w-full bg-[#0c0d16] text-sm text-white font-bold p-3 rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition transition-all duration-250 cursor-pointer"
                            >
                              <option value="small">Small (Küçük)</option>
                              <option value="regular">Regular (Normal)</option>
                              <option value="large">Large (Büyük)</option>
                              <option value="thick">Thick (Kalın)</option>
                              <option value="dot">Dot (Nokta)</option>
                              <option value="plus">Plus (Artı)</option>
                              <option value="dot-cross">Dot-Cross (Noktalı Artı)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5">Grup / Kategori</label>
                            <select
                              value={crosshairForm.group || "main"}
                              onChange={(e) => setCrosshairForm({ ...crosshairForm, group: e.target.value as any })}
                              className="w-full bg-[#0c0d16] text-sm text-white font-bold p-3 rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition transition-all duration-250 cursor-pointer"
                            >
                              <option value="main">CROSSHAİR LİSTESİ</option>
                              <option value="liked">CROSS SERİSİ (Beğenilen)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5">Youtube Video Linki (Opsiyonel)</label>
                          <input
                            type="url"
                            placeholder="Örn: https://youtube.com/watch?v=..."
                            value={crosshairForm.videoUrl || ""}
                            onChange={(e) => setCrosshairForm({ ...crosshairForm, videoUrl: e.target.value })}
                            className="w-full bg-[#0c0d16] text-sm text-white font-bold p-3 rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5">Özel İkon / Görsel (Telefon Fotoğrafı veya Dosya) - Opsiyonel</label>
                          <div className="space-y-3">
                            {crosshairForm.customIcon ? (
                              <div className="flex items-center space-x-3 bg-[#06070c] p-3 rounded-2xl border border-white/5">
                                <img 
                                  src={crosshairForm.customIcon} 
                                  alt="Özel İkon" 
                                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                                />
                                <div className="flex-1">
                                  <p className="text-xs text-white font-bold">Özel Görsel/İkon Eklendi</p>
                                  <p className="text-[9px] text-gray-500 font-mono">Mobil kameradan veya galeriden seçildi</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCrosshairForm(prev => ({ ...prev, customIcon: undefined }))}
                                  className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition cursor-pointer"
                                >
                                  Kaldır
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-purple-500/30 rounded-2xl p-4 bg-[#0c0d16] cursor-pointer transition text-center hover:bg-purple-500/5 group">
                                  <Upload className="h-5 w-5 text-gray-500 mb-2 group-hover:text-purple-400 transition-colors" />
                                  <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Mobilden Fotoğraf Çek veya Galeriden Seç</span>
                                  <span className="text-[9px] text-gray-500 mt-1">Görsel otomatik olarak küçük boyutta optimize edilecektir</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          const compressedBase64 = await compressCrosshairIcon(file);
                                          setCrosshairForm(prev => ({ ...prev, customIcon: compressedBase64 }));
                                        } catch (err: any) {
                                          alert(err.message || "Görsel yüklenirken hata oluştu.");
                                        }
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Visual sliders & Live Preview */}
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-[#0c0d16] border border-white/5 space-y-3">
                          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Canlı Önizleme (Live Preview)</span>
                          
                          {/* Real-time mini SVG-like vector crosshair drawing */}
                          <div className="relative w-16 h-16 bg-gray-950 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                              <div className="w-12 h-12 rounded-full border border-white" />
                              <div className="w-8 h-8 rounded-full border border-white" />
                              <div className="w-4 h-4 rounded-full border border-white" />
                            </div>
                            
                            <div className="relative scale-110 pointer-events-none flex items-center justify-center">
                              {(crosshairForm.outline ?? true) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {(crosshairForm.type === "dot" || crosshairForm.type === "dot-cross") && (
                                    <div 
                                      className="rounded-full bg-black" 
                                      style={{ 
                                        width: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.2 + 2}px`, 
                                        height: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.2 + 2}px`,
                                      }} 
                                    />
                                  )}
                                  {(crosshairForm.type !== "dot") && (
                                    <>
                                      <div 
                                        className="absolute bg-black"
                                        style={{
                                          width: `${(crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2) + 2}px`,
                                          height: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5 + 2}px`,
                                          transform: `translateY(${- (crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) - (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                        }}
                                      />
                                      <div 
                                        className="absolute bg-black"
                                        style={{
                                          width: `${(crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2) + 2}px`,
                                          height: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5 + 2}px`,
                                          transform: `translateY(${(crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) + (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                        }}
                                      />
                                      <div 
                                        className="absolute bg-black"
                                        style={{
                                          width: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5 + 2}px`,
                                          height: `${(crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2) + 2}px`,
                                          transform: `translateX(${- (crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) - (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                        }}
                                      />
                                      <div 
                                        className="absolute bg-black"
                                        style={{
                                          width: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5 + 2}px`,
                                          height: `${(crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2) + 2}px`,
                                          transform: `translateX(${(crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) + (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                              )}

                              <div className="relative flex items-center justify-center">
                                {(crosshairForm.type === "dot" || crosshairForm.type === "dot-cross") && (
                                  <div 
                                    className="rounded-full shadow-sm z-10" 
                                    style={{ 
                                      backgroundColor: crosshairForm.color || "#ffffff",
                                      width: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.2}px`, 
                                      height: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.2}px`,
                                    }} 
                                  />
                                )}
                                {(crosshairForm.type !== "dot") && (
                                  <>
                                    <div 
                                      className="absolute"
                                      style={{
                                        backgroundColor: crosshairForm.color || "#ffffff",
                                        width: `${crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2}px`,
                                        height: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5}px`,
                                        transform: `translateY(${- (crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) - (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                      }}
                                    />
                                    <div 
                                      className="absolute"
                                      style={{
                                        backgroundColor: crosshairForm.color || "#ffffff",
                                        width: `${crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2}px`,
                                        height: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5}px`,
                                        transform: `translateY(${(crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) + (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                      }}
                                    />
                                    <div 
                                      className="absolute"
                                      style={{
                                        backgroundColor: crosshairForm.color || "#ffffff",
                                        width: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5}px`,
                                        height: `${crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2}px`,
                                        transform: `translateX(${- (crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) - (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                      }}
                                    />
                                    <div 
                                      className="absolute"
                                      style={{
                                        backgroundColor: crosshairForm.color || "#ffffff",
                                        width: `${(crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 5}px`,
                                        height: `${crosshairForm.thickness !== undefined ? Number(crosshairForm.thickness) : 1.2}px`,
                                        transform: `translateX(${(crosshairForm.gap !== undefined ? Number(crosshairForm.gap) : -2) + (crosshairForm.size !== undefined ? Number(crosshairForm.size) : 2.5) * 2.5}px)`
                                      }}
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Renk (Hex/Code)</label>
                            <span className="text-[10px] font-mono text-gray-500">{crosshairForm.color}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={crosshairForm.color || "#ffffff"}
                              onChange={(e) => setCrosshairForm({ ...crosshairForm, color: e.target.value })}
                              className="w-10 h-10 bg-transparent rounded cursor-pointer border-0 p-0"
                            />
                            <input
                              type="text"
                              value={crosshairForm.color || ""}
                              onChange={(e) => setCrosshairForm({ ...crosshairForm, color: e.target.value })}
                              className="flex-1 bg-[#0c0d16] text-sm text-white font-mono p-2.5 rounded-xl border border-white/5 outline-none focus:border-purple-500/50"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Boyut (Size)</label>
                            <span className="text-xs font-bold text-purple-400">{crosshairForm.size}</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={crosshairForm.size || 2.5}
                            onChange={(e) => setCrosshairForm({ ...crosshairForm, size: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Boşluk (Gap)</label>
                            <span className="text-xs font-bold text-purple-400">{crosshairForm.gap}</span>
                          </div>
                          <input
                            type="range"
                            min="-10"
                            max="10"
                            step="1"
                            value={crosshairForm.gap !== undefined ? crosshairForm.gap : -2}
                            onChange={(e) => setCrosshairForm({ ...crosshairForm, gap: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Kalınlık (Thickness)</label>
                            <span className="text-xs font-bold text-purple-400">{crosshairForm.thickness}</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={crosshairForm.thickness || 1.2}
                            onChange={(e) => setCrosshairForm({ ...crosshairForm, thickness: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0c0d16] border border-white/5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Kenar Çizgisi (Outline)</label>
                          <input
                            type="checkbox"
                            checked={crosshairForm.outline ?? true}
                            onChange={(e) => setCrosshairForm({ ...crosshairForm, outline: e.target.checked })}
                            className="h-4 w-4 rounded bg-[#0c0d16] border-white/10 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => { setIsAddingCrosshair(false); setEditingCrosshair(null); }}
                        className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] transition cursor-pointer"
                      >
                        Değişiklikleri Kaydet
                      </button>
                    </div>
                  </form>
                ) : (
                  // List Mode
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-1">
                          MEVCUT CROSSHAİRLER ({crosshairs?.length || 0})
                        </h3>
                        <p className="text-xs text-gray-400 font-medium font-sans">
                          Crosshair galerisindeki nişangah kodlarını ekleyebilir, silebilir ve ince ayarlarını düzenleyebilirsiniz.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCrosshairClick}
                        className="rounded-2xl bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(147,51,234,0.4)] transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Yeni Crosshair Ekle</span>
                      </button>
                    </div>

                    {(!crosshairs || crosshairs.length === 0) ? (
                      <div className="text-center py-12 bg-white/5 border border-white/5 rounded-3xl text-gray-500">
                        <Target className="h-12 w-12 text-gray-600 mx-auto mb-3 animate-pulse" />
                        <span className="text-sm font-bold block uppercase tracking-wider mb-1">Henüz Crosshair Bulunmuyor</span>
                        <span className="text-xs">Yeni bir tane eklemek için "+ Yeni Crosshair Ekle" butonunu kullanabilirsiniz.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {crosshairs.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition gap-4"
                          >
                            <div className="flex items-center space-x-4">
                              {/* Visual Mini Box with static mini representation */}
                              <div className="p-1 rounded-2xl bg-[#0c0d16] border border-white/10 flex items-center justify-center">
                                <div className="relative w-12 h-12 bg-gray-950 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden scale-90">
                                  {item.customIcon ? (
                                    <img 
                                      src={item.customIcon} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="relative pointer-events-none flex items-center justify-center scale-90">
                                      {(item.outline ?? true) && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          {(item.type === "dot" || item.type === "dot-cross") && (
                                            <div 
                                              className="rounded-full bg-black" 
                                              style={{ 
                                                width: `${(item.size !== undefined ? Number(item.size) : 2.5) * 2.2 + 2}px`, 
                                                height: `${(item.size !== undefined ? Number(item.size) : 2.5) * 2.2 + 2}px`,
                                              }} 
                                            />
                                          )}
                                          {(item.type !== "dot") && (
                                            <>
                                              <div 
                                                className="absolute bg-black"
                                                style={{
                                                  width: `${(item.thickness !== undefined ? Number(item.thickness) : 1.2) + 2}px`,
                                                  height: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5 + 2}px`,
                                                  transform: `translateY(${- (item.gap !== undefined ? Number(item.gap) : -2) - (item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                                }}
                                              />
                                              <div 
                                                className="absolute bg-black"
                                                style={{
                                                  width: `${(item.thickness !== undefined ? Number(item.thickness) : 1.2) + 2}px`,
                                                  height: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5 + 2}px`,
                                                  transform: `translateY(${(item.gap !== undefined ? Number(item.gap) : -2) + (item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                                }}
                                              />
                                              <div 
                                                className="absolute bg-black"
                                                style={{
                                                  width: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5 + 2}px`,
                                                  height: `${(item.thickness !== undefined ? Number(item.thickness) : 1.2) + 2}px`,
                                                  transform: `translateX(${- (item.gap !== undefined ? Number(item.gap) : -2) - (item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                                }}
                                              />
                                              <div 
                                                className="absolute bg-black"
                                                style={{
                                                  width: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5 + 2}px`,
                                                  height: `${(item.thickness !== undefined ? Number(item.thickness) : 1.2) + 2}px`,
                                                  transform: `translateX(${(item.gap !== undefined ? Number(item.gap) : -2) + (item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                                }}
                                              />
                                            </>
                                          )}
                                        </div>
                                      )}

                                      <div className="relative flex items-center justify-center">
                                        {(item.type === "dot" || item.type === "dot-cross") && (
                                          <div 
                                            className="rounded-full shadow-sm z-10" 
                                            style={{ 
                                              backgroundColor: item.color || "#ffffff",
                                              width: `${(item.size !== undefined ? Number(item.size) : 2.5) * 2.2}px`, 
                                              height: `${(item.size !== undefined ? Number(item.size) : 2.5) * 2.2}px`,
                                            }} 
                                          />
                                        )}
                                        {(item.type !== "dot") && (
                                          <>
                                            <div 
                                              className="absolute"
                                              style={{
                                                backgroundColor: item.color || "#ffffff",
                                                width: `${item.thickness !== undefined ? Number(item.thickness) : 1.2}px`,
                                                height: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5}px`,
                                                transform: `translateY(${- (item.gap !== undefined ? Number(item.gap) : -2) - (item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                              }}
                                            />
                                            <div 
                                              className="absolute"
                                              style={{
                                                backgroundColor: item.color || "#ffffff",
                                                width: `${item.thickness !== undefined ? Number(item.thickness) : 1.2}px`,
                                                height: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5}px`,
                                                transform: `translateY(${item.gap !== undefined ? Number(item.gap) : -2} + ${(item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                              }}
                                            />
                                            <div 
                                              className="absolute"
                                              style={{
                                                backgroundColor: item.color || "#ffffff",
                                                width: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5}px`,
                                                height: `${item.thickness !== undefined ? Number(item.thickness) : 1.2}px`,
                                                transform: `translateX(${- (item.gap !== undefined ? Number(item.gap) : -2) - (item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                              }}
                                            />
                                            <div 
                                              className="absolute"
                                              style={{
                                                backgroundColor: item.color || "#ffffff",
                                                width: `${(item.size !== undefined ? Number(item.size) : 2.5) * 5}px`,
                                                height: `${item.thickness !== undefined ? Number(item.thickness) : 1.2}px`,
                                                transform: `translateX(${(item.gap !== undefined ? Number(item.gap) : -2) + (item.size !== undefined ? Number(item.size) : 2.5) * 2.5}px)`
                                              }}
                                            />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-white font-display uppercase tracking-wider">{item.name}</h4>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[9px] font-black uppercase tracking-wider">
                                  <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                    {item.group === "main" ? "Liste" : "Beğenilen"}
                                  </span>
                                  <span className="text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                    Tip: {item.type}
                                  </span>
                                  <span className="text-gray-500 max-w-[150px] truncate" title={item.code}>
                                    Kod: {item.code}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                              {item.videoUrl && (
                                <a
                                  href={item.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-8 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition border border-white/5"
                                  title="Videoyu İzle"
                                >
                                  <Play className="h-3 w-3 text-purple-400" />
                                  <span>Video</span>
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleEditCrosshairClick(item)}
                                className="h-8 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition border border-purple-500/20 cursor-pointer"
                              >
                                Düzenle
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCrosshair(item.id)}
                                className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white inline-flex items-center justify-center transition border border-red-500/20 cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Playlists manager */}
            {activeSubTab === "playlists" && (
              <div className="space-y-6">
                {/* Header block with "Yeni Ekle" button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-500" />
                      YOUTUBE OYNATMA LİSTELERİ
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      Ana sayfada sergilenen YouTube oynatma listesi kartlarını düzenleyin, ekleyin veya kaldırın.
                    </p>
                  </div>

                  {!isAddingPlaylist && !editingPlaylist && (
                    <button
                      type="button"
                      onClick={handleAddPlaylistClick}
                      className="rounded-2xl bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 text-xs font-black uppercase tracking-widest transition duration-300 shadow-lg shadow-purple-600/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yeni Liste Ekle</span>
                    </button>
                  )}
                </div>

                {/* Feedback success banner */}
                {savedSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 animate-pulse">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span>Değişiklikler başarıyla kaydedildi!</span>
                  </div>
                )}

                {/* Form: Add or Edit Playlist */}
                {(isAddingPlaylist || editingPlaylist) ? (
                  <form onSubmit={handleSavePlaylistSubmit} className="space-y-4 p-5 rounded-3xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-2">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">
                        {isAddingPlaylist ? "YENİ OYNATMA LİSTESİ EKLE" : "OYNATMA LİSTESİNİ DÜZENLE"}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setIsAddingPlaylist(false); setEditingPlaylist(null); }}
                        className="text-gray-400 hover:text-white transition"
                        title="Vazgeç"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Playlist Title */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">LİSTE BAŞLIĞI</label>
                        <input
                          type="text"
                          required
                          value={playlistForm.title || ""}
                          onChange={(e) => setPlaylistForm({ ...playlistForm, title: e.target.value })}
                          placeholder="Örn: CS2 Bomba Taktikleri & İpuçları"
                          className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      {/* Video Count */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">VİDEO SAYISI</label>
                        <input
                          type="number"
                          value={playlistForm.videoCount !== undefined ? playlistForm.videoCount : 0}
                          onChange={(e) => setPlaylistForm({ ...playlistForm, videoCount: Number(e.target.value) })}
                          placeholder="Örn: 15"
                          min="0"
                          className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Playlist URL */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">YOUTUBE OYNATMA LİSTESİ URL</label>
                        <input
                          type="url"
                          required
                          value={playlistForm.url || ""}
                          onChange={(e) => setPlaylistForm({ ...playlistForm, url: e.target.value })}
                          placeholder="https://www.youtube.com/playlist?list=..."
                          className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      {/* Thumbnail Cover Image */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase block font-bold">KAPAK GÖRSELİ (URL)</label>
                        <input
                          type="text"
                          value={playlistForm.thumbnail || ""}
                          onChange={(e) => setPlaylistForm({ ...playlistForm, thumbnail: e.target.value })}
                          placeholder="Örn: https://images.unsplash.com/... veya YouTube resim linki"
                          className="w-full rounded-xl bg-[#0c0d16] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsAddingPlaylist(false); setEditingPlaylist(null); }}
                        className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/10"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Oynatma Listesini Kaydet</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Playlists Cards Grid List inside Admin Control Panel */
                  <div className="space-y-3">
                    {playlists.length === 0 ? (
                      <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/5">
                        <Youtube className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">KAYITLI OYNATMA LİSTESİ BULUNAMADI</span>
                        <p className="text-[10px] text-gray-600 font-medium mt-1">Siteniz için yukarıdaki butondan yeni oynatma listeleri ekleyebilirsiniz.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {playlists.map((playlist, idx) => {
                          const itemId = playlist.id || playlist.title;
                          return (
                            <div
                              key={itemId}
                              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition gap-4"
                            >
                              <div className="flex items-center space-x-4">
                                {/* Playlist Cover mini preview */}
                                <div className="p-1 rounded-2xl bg-[#0c0d16] border border-white/10 flex items-center justify-center">
                                  <img
                                    src={playlist.thumbnail}
                                    alt={playlist.title}
                                    referrerPolicy="no-referrer"
                                    className="w-14 h-10 object-cover rounded-lg border border-white/5"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm text-white font-display uppercase tracking-wider">{playlist.title}</h4>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[9px] font-black uppercase tracking-wider">
                                    <span className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                      {playlist.videoCount} Video
                                    </span>
                                    <a
                                      href={playlist.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 hover:text-white flex items-center gap-1 transition"
                                    >
                                      <span>LİNK</span>
                                      <ExternalLink className="h-2 w-2" />
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleEditPlaylistClick(playlist)}
                                  className="h-8 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition border border-purple-500/20 cursor-pointer"
                                >
                                  Düzenle
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePlaylist(itemId)}
                                  className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white inline-flex items-center justify-center transition border border-red-500/20 cursor-pointer"
                                  title="Sil"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: System Specifications Management */}
            {activeSubTab === "specs" && (
              <div className="space-y-6" id="specs-tab-content">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block">
                    // SİSTEM DONANIM VE EKİPMANLARI LİSTESİ
                  </span>
                  {!isAddingSpec && !editingSpec && (
                    <button
                      type="button"
                      onClick={handleAddSpecClick}
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/10"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yeni Özellik Ekle</span>
                    </button>
                  )}
                </div>

                {isAddingSpec || editingSpec ? (
                  <form onSubmit={handleSaveSpecSubmit} className="space-y-4 max-w-xl bg-white/5 p-6 rounded-3xl border border-white/5">
                    <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider mb-2">
                      {isAddingSpec ? "Yeni Donanım / Ekipman Ekle" : "Donanım / Ekipman Özelliğini Düzenle"}
                    </h3>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Donanım Kategorisi * (Örn: İŞLEMCİ, EKRAN KARTI, MONİTÖR, MOUSE)
                      </label>
                      <input
                        type="text"
                        value={specForm.category || ""}
                        onChange={(e) => setSpecForm({ ...specForm, category: e.target.value })}
                        placeholder="Örn: İŞLEMCİ (CPU)"
                        className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Ürün Adı/Markası *
                        </label>
                        <input
                          type="text"
                          value={specForm.name || ""}
                          onChange={(e) => setSpecForm({ ...specForm, name: e.target.value })}
                          placeholder="Örn: AMD Ryzen 7 7800X3D"
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Değer / Açıklama (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={specForm.value || ""}
                          onChange={(e) => setSpecForm({ ...specForm, value: e.target.value })}
                          placeholder="Örn: 4.2GHz (up to 5.0GHz) 104MB"
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t border-white/5 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingSpec(false);
                          setEditingSpec(null);
                        }}
                        className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/10"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Kaydet</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {systemSpecs.length === 0 ? (
                      <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/5">
                        <Sliders className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">KAYITLI SİSTEM BİLGİSİ BULUNAMADI</span>
                        <p className="text-[10px] text-gray-600 font-medium mt-1">Siteniz için yukarıdaki butondan donanım ve ekipman bilgileri ekleyebilirsiniz.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5">
                        {systemSpecs.map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition gap-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                              <span className="font-mono text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 max-w-max">
                                {spec.category}
                              </span>
                              <div>
                                <span className="font-bold text-xs text-white uppercase tracking-wider">{spec.name}</span>
                                {spec.value && (
                                  <span className="text-xs text-gray-400 font-mono font-medium ml-2 border-l border-white/10 pl-2">
                                    {spec.value}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleEditSpecClick(spec, idx)}
                                className="h-7 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white inline-flex items-center justify-center text-[9px] font-bold uppercase tracking-wider transition border border-purple-500/20 cursor-pointer"
                              >
                                Düzenle
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSpecClick(idx)}
                                className="h-7 w-7 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white inline-flex items-center justify-center transition border border-red-500/20 cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Announcement Management (Duyuru Paneli) */}
            {activeSubTab === "announcements" && (
              <div className="space-y-6" id="announcements-tab-content">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block">
                    // SİTE DUYURULARI VE GÜNCELLEMELERİ LİSTESİ
                  </span>
                  {!isAddingAnnouncement && !editingAnnouncement && (
                    <button
                      type="button"
                      onClick={handleAddAnnouncementClick}
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/10"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yeni Duyuru Yayınla</span>
                    </button>
                  )}
                </div>

                {isAddingAnnouncement || editingAnnouncement ? (
                  <form onSubmit={handleSaveAnnouncementSubmit} className="space-y-4 max-w-2xl bg-white/5 p-6 rounded-3xl border border-white/5">
                    <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider mb-2">
                      {isAddingAnnouncement ? "Yeni Duyuru Yayınla" : "Duyuruyu Düzenle"}
                    </h3>

                    {/* Duyuru Taslakları (Announcement Templates) */}
                    <div className="bg-[#0b0c15] border border-purple-500/20 p-4 rounded-2xl" id="announcement-templates-box">
                      <span className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                        Hızlı Duyuru Şablonları / Taslaklar
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {ANNOUNCEMENT_TEMPLATES.map((tmpl) => (
                          <button
                            key={tmpl.name}
                            type="button"
                            onClick={() => {
                              setAnnouncementForm({
                                ...announcementForm,
                                titleTR: tmpl.titleTR,
                                titleEN: tmpl.titleEN,
                                contentTR: tmpl.contentTR,
                                contentEN: tmpl.contentEN,
                                badgeTR: tmpl.badgeTR,
                                badgeEN: tmpl.badgeEN,
                                importance: tmpl.importance as any,
                              });
                              showToast(`"${tmpl.name}" şablonu yüklendi!`, "success");
                            }}
                            className="text-[10px] font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 px-2.5 py-2 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center text-center leading-tight hover:scale-[1.02]"
                          >
                            {tmpl.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Badge & Importance & Active Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Önem Derecesi
                        </label>
                        <select
                          value={announcementForm.importance || "medium"}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, importance: e.target.value as any })}
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none transition"
                        >
                          <option value="low">Düşük (Mavi)</option>
                          <option value="medium">Orta (Mor)</option>
                          <option value="high">Yüksek (Kırmızı / Pinli)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Etiket (TR) (Örn: DUYURU, TURNUVA)
                        </label>
                        <input
                          type="text"
                          value={announcementForm.badgeTR || ""}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, badgeTR: e.target.value })}
                          placeholder="ÖRN: TURNUVA"
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Etiket (EN) (Örn: ANNOUNCEMENT)
                        </label>
                        <input
                          type="text"
                          value={announcementForm.badgeEN || ""}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, badgeEN: e.target.value })}
                          placeholder="ÖRN: TOURNAMENT"
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Duyuru Başlığı (Türkçe) *
                        </label>
                        <input
                          type="text"
                          value={announcementForm.titleTR || ""}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, titleTR: e.target.value })}
                          placeholder="Duyuru başlığını giriniz"
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Duyuru Başlığı (İngilizce - Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={announcementForm.titleEN || ""}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, titleEN: e.target.value })}
                          placeholder="Duyuru başlığını İngilizce giriniz"
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Content (TR) */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Duyuru İçeriği (Türkçe) *
                      </label>
                      <textarea
                        value={announcementForm.contentTR || ""}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, contentTR: e.target.value })}
                        placeholder="Yayınlamak istediğiniz duyuru detayları..."
                        rows={4}
                        className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition resize-none font-medium"
                        required
                      />
                    </div>

                    {/* Content (EN) */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Duyuru İçeriği (İngilizce - Opsiyonel)
                      </label>
                      <textarea
                        value={announcementForm.contentEN || ""}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, contentEN: e.target.value })}
                        placeholder="Duyuru detaylarını İngilizce giriniz..."
                        rows={4}
                        className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition resize-none font-medium"
                      />
                    </div>

                    {/* Active Checkbox */}
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="ann-active-checkbox"
                        checked={announcementForm.active !== false}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, active: e.target.checked })}
                        className="rounded border-white/10 bg-[#0e0f1a] text-purple-600 focus:ring-purple-500/20"
                      />
                      <label htmlFor="ann-active-checkbox" className="text-xs text-gray-300 font-bold select-none cursor-pointer">
                        Bu Duyuruyu Sitede Göster (Aktif Et)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t border-white/5 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAnnouncement(false);
                          setEditingAnnouncement(null);
                        }}
                        className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/10"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Duyuruyu Yayınla</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {announcements.length === 0 ? (
                      <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/5">
                        <Megaphone className="h-10 w-10 text-gray-600 mx-auto mb-3 animate-pulse" />
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">KAYITLI DUYURU BULUNAMADI</span>
                        <p className="text-[10px] text-gray-600 font-medium mt-1">Siteniz için yukarıdaki butondan şık duyurular ekleyip yayına alabilirsiniz.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {announcements.map((ann) => (
                          <div
                            key={ann.id}
                            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition gap-4 ${
                              !ann.active ? "opacity-50" : ""
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  ann.importance === "high" ? "bg-red-500 animate-ping" :
                                  ann.importance === "medium" ? "bg-purple-500" :
                                  "bg-blue-500"
                                }`} />
                                {ann.badgeTR && (
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    {ann.badgeTR}
                                  </span>
                                )}
                                <span className="text-[9px] font-mono text-gray-500">{ann.date}</span>
                                {!ann.active && (
                                  <span className="text-[9px] font-black uppercase text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">PASİF</span>
                                )}
                              </div>
                              <h4 className="font-bold text-xs sm:text-sm text-white font-display uppercase tracking-wider truncate">
                                {ann.titleTR}
                              </h4>
                              <p className="text-[11px] text-gray-400 font-semibold line-clamp-1 mt-0.5">
                                {ann.contentTR}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleEditAnnouncementClick(ann)}
                                className="h-8 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition border border-purple-500/20 cursor-pointer"
                              >
                                Düzenle
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAnnouncementClick(ann.id)}
                                className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white inline-flex items-center justify-center transition border border-red-500/20 cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

          {/* Footer of modal */}
          <div className="border-t border-white/5 pt-4 mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition"
            >
              Kapat
            </button>
          </div>

        </div>

      </motion.div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {crosshairToDeleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e0f1a] border border-red-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left"
            >
              {/* Decorative danger background element */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center space-x-3 text-red-400 mb-4">
                <AlertCircle className="h-6 w-6 animate-pulse" />
                <h4 className="font-display text-base font-extrabold tracking-wider uppercase">
                  NİŞANGAHI SİL?
                </h4>
              </div>

              <p className="text-xs text-gray-400 font-semibold mb-6 leading-relaxed">
                Bu crosshair ögesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCrosshairToDeleteId(null)}
                  className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCrosshair}
                  className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.3)] transition cursor-pointer"
                >
                  Evet, Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal for Playlists */}
      <AnimatePresence>
        {playlistToDeleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e0f1a] border border-red-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left"
            >
              {/* Decorative danger background element */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center space-x-3 text-red-400 mb-4">
                <AlertCircle className="h-6 w-6 animate-pulse" />
                <h4 className="font-display text-base font-extrabold tracking-wider uppercase">
                  OYNATMA LİSTESİNİ SİL?
                </h4>
              </div>

              <p className="text-xs text-gray-400 font-semibold mb-6 leading-relaxed">
                Bu oynatma listesi ögesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPlaylistToDeleteId(null)}
                  className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePlaylist}
                  className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.3)] transition cursor-pointer"
                >
                  Evet, Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal for Specs */}
      <AnimatePresence>
        {specToDeleteIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e0f1a] border border-red-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left"
            >
              {/* Decorative danger background element */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center space-x-3 text-red-400 mb-4">
                <AlertCircle className="h-6 w-6 animate-pulse" />
                <h4 className="font-display text-base font-extrabold tracking-wider uppercase">
                  ÖZELLİĞİ SİL?
                </h4>
              </div>

              <p className="text-xs text-gray-400 font-semibold mb-6 leading-relaxed">
                Bu donanım/ekipman bilgisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSpecToDeleteIndex(null)}
                  className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteSpec}
                  className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.3)] transition cursor-pointer"
                >
                  Evet, Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal for Announcements */}
      <AnimatePresence>
        {announcementToDeleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e0f1a] border border-red-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left"
            >
              {/* Decorative danger background element */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center space-x-3 text-red-400 mb-4">
                <AlertCircle className="h-6 w-6 animate-pulse" />
                <h4 className="font-display text-base font-extrabold tracking-wider uppercase">
                  DUYURUYU SİL?
                </h4>
              </div>

              <p className="text-xs text-gray-400 font-semibold mb-6 leading-relaxed">
                Bu duyuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAnnouncementToDeleteId(null)}
                  className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteAnnouncement}
                  className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.3)] transition cursor-pointer"
                >
                  Evet, Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification Stack */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, x: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="pointer-events-auto w-full rounded-2xl bg-[#0c0d16]/95 border border-white/5 backdrop-blur-md p-4 flex items-start gap-3 shadow-2xl relative overflow-hidden"
              style={{
                borderColor: 
                  toast.type === "success" ? "rgba(16, 185, 129, 0.25)" :
                  toast.type === "error" ? "rgba(239, 68, 68, 0.25)" :
                  "rgba(168, 85, 247, 0.25)",
                boxShadow:
                  toast.type === "success" ? "0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px rgba(16, 185, 129, 0.15)" :
                  toast.type === "error" ? "0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px rgba(239, 68, 68, 0.15)" :
                  "0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px rgba(168, 85, 247, 0.15)"
              }}
            >
              {/* Glowing left accent border strip */}
              <div 
                className={`absolute top-0 bottom-0 left-0 w-1 ${
                  toast.type === "success" ? "bg-emerald-500" :
                  toast.type === "error" ? "bg-red-500" :
                  "bg-purple-500"
                }`} 
              />

              {/* Toast Icon */}
              <div className="shrink-0 mt-0.5">
                {toast.type === "success" && (
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                {toast.type === "error" && (
                  <div className="h-6 w-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                )}
                {toast.type === "info" && (
                  <div className="h-6 w-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Info className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Toast Messages */}
              <div className="flex-1 min-w-0">
                <h5 className="text-[10px] font-extrabold text-white uppercase tracking-wider mb-0.5 font-display">
                  {toast.type === "success" ? "BAŞARILI" : toast.type === "error" ? "HATA" : "BİLGİ"}
                </h5>
                <p className="text-[11px] text-gray-300 font-semibold leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Toast Close button */}
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-gray-500 hover:text-white transition duration-200 cursor-pointer shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
