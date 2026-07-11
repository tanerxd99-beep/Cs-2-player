import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Save, Image, User, Shield, Users, Mail, Tv, 
  Settings2, Trash2, Check, RefreshCw, MessageSquare, AlertCircle, Award,
  Upload, Smartphone, Sliders, Play, Info, Plus, Target, ExternalLink,
  LayoutDashboard, Radio, Eye, Activity, Youtube, Megaphone, Cpu, Layers, Bell,
  Sparkles, Download, Gift, Trophy, Search, Filter, CheckCheck, Copy, MailOpen,
  Menu, LogOut, Link
} from "lucide-react";
import { UserProfile } from "./EditProfileModal";
import { UserAccount } from "./AuthModal";
import { CS2SettingsData } from "./CS2SettingsSection";
import { CrosshairItem, PlaylistItem, SpecItem, Announcement, GiveawayItem } from "../types";
import { DEFAULT_GIVEAWAYS } from "../data";
import { triggerWebhook } from "../utils/webhookHelper";
import { WebhookIntegrationsPanel } from "./WebhookIntegrationsPanel";

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
  kickApiEnabled?: boolean;
  onToggleKickApi?: (enabled: boolean) => void;
  kickApiLogs?: string[];
  notificationsEnabled?: boolean;
  onToggleNotifications?: () => void;
}

interface MessageInboxItem {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read?: boolean;
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
  onSaveVisitorCount,
  kickApiEnabled = false,
  onToggleKickApi,
  kickApiLogs = [],
  notificationsEnabled = false,
  onToggleNotifications
}: AdminPanelModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "profile" | "settings" | "inbox" | "users" | "stream" | "crosshairs" | "playlists" | "specs" | "announcements" | "giveaways" | "integrations">("dashboard");
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [settingsForm, setSettingsForm] = useState<CS2SettingsData>({ ...cs2Settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Search, Filter, and Reader States for Inbox & Registered Users
  const [inboxSearch, setInboxSearch] = useState("");
  const [inboxFilter, setInboxFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "admin" | "user">("all");

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
    if (selectedMessageId === id) {
      setSelectedMessageId(null);
    }
    showToast("Mesaj başarıyla silindi!", "success");
  };

  const handleToggleMessageRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: !m.read } : m);
    setMessages(updated);
    localStorage.setItem("weew_messages", JSON.stringify(updated));
  };

  const handleMarkAllMessagesRead = () => {
    const updated = messages.map(m => ({ ...m, read: true }));
    setMessages(updated);
    localStorage.setItem("weew_messages", JSON.stringify(updated));
    showToast("Tüm mesajlar okundu olarak işaretlendi!", "success");
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

  const handleUpdateUserRole = (emailToUpdate: string, newRole: "admin" | "user") => {
    if (emailToUpdate === "iremsaltanat002001@gmail.com") {
      showToast("Kurucu admin rolü değiştirilemez!", "error");
      return;
    }

    const raw = localStorage.getItem("weew_registered_users");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed[emailToUpdate]) {
          parsed[emailToUpdate].role = newRole;
          localStorage.setItem("weew_registered_users", JSON.stringify(parsed));
          loadRegisteredUsers();
          showToast(`Kullanıcı rolü '${newRole.toUpperCase()}' olarak güncellendi!`, "success");
        }
      } catch (e) {
        showToast("Rol güncellenirken bir hata oluştu.", "error");
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


  // ==========================================
  // Giveaway Management States & Handlers
  // ==========================================
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

  // Keep synced with any changes
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

  const saveAdminGiveaways = (updated: GiveawayItem[]) => {
    setGiveaways(updated);
    localStorage.setItem("weew_giveaways", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("weew_giveaway_update"));
  };

  const [newGiveawayPrize, setNewGiveawayPrize] = useState("");
  const [newGiveawayDescTR, setNewGiveawayDescTR] = useState("");
  const [newGiveawayDescEN, setNewGiveawayDescEN] = useState("");
  const [newGiveawayDuration, setNewGiveawayDuration] = useState("30"); // in minutes
  const [isCreatingGiveaway, setIsCreatingGiveaway] = useState(false);
  const [newEntrantName, setNewEntrantName] = useState("");

  const handleCreateGiveaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiveawayPrize.trim()) {
      showToast("Lütfen ödül adını giriniz!", "error");
      return;
    }

    // Cancel all active giveaways first
    const updatedGiveaways = giveaways.map(g => {
      if (g.status === "active") {
        return {
          ...g,
          status: "cancelled" as const,
          endTime: new Date().toISOString()
        };
      }
      return g;
    });

    const durationMin = Number(newGiveawayDuration) || 30;
    const newGiveaway: GiveawayItem = {
      id: `giveaway-${Date.now()}`,
      prize: newGiveawayPrize.trim(),
      descriptionTR: newGiveawayDescTR.trim() || "Özel topluluk çekilişi! Hemen adını yazdırıp şansını dene.",
      descriptionEN: newGiveawayDescEN.trim() || "Special community giveaway! Put down your name and test your luck.",
      endTime: new Date(Date.now() + durationMin * 60000).toISOString(),
      status: "active" as const,
      winner: null,
      entrants: currentUser ? [currentUser.name] : [],
      createdAt: new Date().toISOString()
    };

    saveAdminGiveaways([newGiveaway, ...updatedGiveaways]);
    setNewGiveawayPrize("");
    setNewGiveawayDescTR("");
    setNewGiveawayDescEN("");
    setIsCreatingGiveaway(false);
    showToast("Yeni interaktif çekiliş başarıyla başlatıldı!", "success");
  };

  const handleDeleteGiveaway = (id: string) => {
    const updated = giveaways.filter(g => g.id !== id);
    saveAdminGiveaways(updated);
    showToast("Çekiliş başarıyla silindi!", "success");
  };

  const handleCancelGiveaway = (id: string) => {
    const updated = giveaways.map(g => {
      if (g.id === id) {
        return { ...g, status: "cancelled" as const, endTime: new Date().toISOString() };
      }
      return g;
    });
    saveAdminGiveaways(updated);
    showToast("Çekiliş iptal edildi!", "info");
  };

  const handleAddManualEntrant = (giveawayId: string) => {
    if (!newEntrantName.trim()) return;
    const target = giveaways.find(g => g.id === giveawayId);
    if (!target) return;

    if (target.entrants.includes(newEntrantName.trim())) {
      showToast("Bu kullanıcı zaten çekilişe katılmış!", "error");
      return;
    }

    const updated = giveaways.map(g => {
      if (g.id === giveawayId) {
        return { ...g, entrants: [...g.entrants, newEntrantName.trim()] };
      }
      return g;
    });

    saveAdminGiveaways(updated);
    setNewEntrantName("");
    showToast(`${newEntrantName.trim()} çekilişe manuel olarak eklendi!`, "success");
  };

  const handleKickEntrant = (giveawayId: string, nameToKick: string) => {
    const updated = giveaways.map(g => {
      if (g.id === giveawayId) {
        return { ...g, entrants: g.entrants.filter(e => e !== nameToKick) };
      }
      return g;
    });
    saveAdminGiveaways(updated);
    showToast(`${nameToKick} çekilişten çıkarıldı!`, "info");
  };

  const handleAddMockEntrants = (giveawayId: string) => {
    const botNames = [
      "cs2_pro_99", "kick_enjoyer", "faceit_demon", "shroud_junior", "heatoN_fan", 
      "lozan_fani", "unlost_pro", "cs2_caner", "reaper_cs", "s1mple_junior", 
      "headshot_machine", "berk_pasha", "wooting_keyboard_user", "aimstar", "toxic_clutcher",
      "rush_b_dont_stop", "flashbang_enjoyer", "dragon_lore_owner", "hyper_beast"
    ];

    const target = giveaways.find(g => g.id === giveawayId);
    if (!target) return;

    // Filter bots not already in entrants
    const availableBots = botNames.filter(b => !target.entrants.includes(b));
    if (availableBots.length === 0) {
      showToast("Eklenebilecek daha fazla bot kalmadı!", "error");
      return;
    }

    // Add 5 random bots or all available
    const countToAdd = Math.min(5, availableBots.length);
    const shuffledBots = [...availableBots].sort(() => Math.random() - 0.5).slice(0, countToAdd);

    const updated = giveaways.map(g => {
      if (g.id === giveawayId) {
        return { ...g, entrants: [...g.entrants, ...shuffledBots] };
      }
      return g;
    });

    saveAdminGiveaways(updated);
    showToast(`${countToAdd} adet simüle katılımcı eklendi!`, "success");
  };

  const handleAdminDrawGiveaway = (giveawayId: string) => {
    const target = giveaways.find(g => g.id === giveawayId);
    if (!target) return;
    if (target.entrants.length === 0) {
      showToast("Çekilişi gerçekleştirmek için en az 1 katılımcı olmalıdır!", "error");
      return;
    }

    // Generate parameters for the live visual spin
    const list = [...target.entrants];
    const shuffledList = [...list].sort(() => Math.random() - 0.5);
    let spinStrip: string[] = [];
    while (spinStrip.length < 50) {
      spinStrip = [...spinStrip, ...shuffledList.sort(() => Math.random() - 0.5)];
    }

    const winningIndex = Math.floor(Math.random() * 8) + 38; // somewhere between 38 and 45
    const winnerName = spinStrip[winningIndex];

    // Broadcast the drawing trigger to everyone instantly
    const trigger = {
      giveawayId: target.id,
      winner: winnerName,
      winningIndex,
      spinList: spinStrip,
      timestamp: Date.now()
    };
    
    localStorage.setItem("weew_active_spin_trigger", JSON.stringify(trigger));
    window.dispatchEvent(new CustomEvent("weew_active_spin_trigger_fired", { detail: trigger }));

    showToast(`Canlı kura çarkı başlatıldı! Kazanan belirleniyor...`, "info");

    // Automatically update the database / state after the spin finishes (5 seconds)
    setTimeout(() => {
      const currentSaved = localStorage.getItem("weew_giveaways");
      if (currentSaved) {
        try {
          const parsed: GiveawayItem[] = JSON.parse(currentSaved);
          const updated = parsed.map(g => {
            if (g.id === target.id && g.status === "active") {
              return {
                ...g,
                status: "completed" as const,
                winner: winnerName,
                endTime: new Date().toISOString()
              };
            }
            return g;
          });
          saveAdminGiveaways(updated);
        } catch (e) {
          // ignore
        }
      }
    }, 5000);
  };

  const handleResetGiveawaysToDefault = () => {
    if (confirm("Tüm çekiliş verilerini varsayılana döndürmek istediğinize emin misiniz?")) {
      saveAdminGiveaways(DEFAULT_GIVEAWAYS);
      showToast("Çekiliş verileri sıfırlandı!", "success");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden font-sans bg-[#0c0d16] text-white">
      {/* Mobile Sidebar overlay backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar - mimicking screenshot exactly */}
      <div className={`
        fixed inset-y-0 left-0 z-40 flex flex-col w-[260px] bg-[#2a3038] text-[#a3a8b1] transition-transform duration-300 transform shrink-0
        md:translate-x-0 md:relative md:flex h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand Area */}
        <div className="flex items-center justify-between h-16 px-5 bg-[#242930] shrink-0 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#007bff] text-white font-bold text-sm shadow-md">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-display font-black text-white text-xs tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation Items - mapped exactly like the screenshot */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
          {[
            { type: "header" as const, label: "Yönetim Paneli" },
            { id: "dashboard", label: "Dashboard", subTab: "dashboard" as const, icon: LayoutDashboard },
            { id: "announcements", label: "Duyuru Paneli (Duyurular)", subTab: "announcements" as const, icon: Megaphone, badge: announcements.length },
            { id: "inbox", label: "Gelen İletişim Formları", subTab: "inbox" as const, icon: Mail, badge: messages.length },
            { id: "users", label: "Kayıtlı Kullanıcılar", subTab: "users" as const, icon: Users },

            { type: "header" as const, label: "Site İçeriği" },
            { id: "profile", label: "Profil & Slider Yönetimi", subTab: "profile" as const, icon: Image },
            { id: "crosshairs", label: "Nişangah (Crosshair) Listesi", subTab: "crosshairs" as const, icon: Target },
            { id: "specs", label: "Sistem & Donanım Özellikleri", subTab: "specs" as const, icon: Cpu },
            { id: "playlists", label: "YouTube Çalma Listeleri", subTab: "playlists" as const, icon: Youtube },

            { type: "header" as const, label: "Etkinlikler & Ayarlar" },
            { id: "stream", label: "Canlı Yayın & Simülasyon", subTab: "stream" as const, icon: Radio },
            { id: "giveaways", label: "İnteraktif Çekiliş Yönetimi", subTab: "giveaways" as const, icon: Gift },
            { id: "integrations", label: "Discord & Webhook", subTab: "integrations" as const, icon: Link },
            { id: "settings", label: "Sistem & Site Ayarları", subTab: "settings" as const, icon: Settings2 }
          ].map((item, idx) => {
            if ("type" in item && item.type === "header") {
              return (
                <div 
                  key={`section-hdr-${idx}`} 
                  className="px-4 pt-4 pb-1.5 text-[8.5px] font-black uppercase tracking-widest text-[#6c757d] border-t border-white/5 first:border-t-0 first:pt-1 mt-3 first:mt-0"
                >
                  {item.label}
                </div>
              );
            }

            // At this point item is an interactive item
            const interactiveItem = item as { 
              id: string; 
              label: string; 
              subTab: typeof activeSubTab; 
              icon: typeof LayoutDashboard; 
              badge?: number; 
              hasArrow?: boolean; 
            };

            const isTabActive = activeSubTab === interactiveItem.subTab;

            return (
              <button
                key={interactiveItem.id}
                onClick={() => {
                  handleTabChange(interactiveItem.subTab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition duration-150 cursor-pointer text-left ${
                  isTabActive
                    ? "bg-[#007bff] text-white shadow-md font-bold"
                    : "text-[#a3a8b1] hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <interactiveItem.icon className={`h-4 w-4 shrink-0 ${isTabActive ? "text-white" : "text-[#8b95a5]"}`} />
                  <span className="truncate">{interactiveItem.label}</span>
                </div>
                
                <div className="flex items-center space-x-1.5 shrink-0">
                  {interactiveItem.badge !== undefined && interactiveItem.badge > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[8px] font-black leading-none">
                      {interactiveItem.badge}
                    </span>
                  )}
                  {interactiveItem.hasArrow && (
                    <span className="text-[8px] text-gray-500">▼</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Top Header Bar */}
        <div className="h-16 border-b px-4 md:px-6 flex items-center justify-between shrink-0 bg-[#0f111c] border-white/5">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-400 hover:text-white p-1.5 rounded-lg focus:outline-none"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            
            {/* Breadcrumbs next to burger (hidden on small mobile) */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider">
              <span className="text-gray-500">Panel</span>
              <span className="text-gray-600">/</span>
              <span className="capitalize text-purple-400 font-extrabold">{activeSubTab}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell Icon */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className={`relative transition p-1.5 rounded-full cursor-pointer ${
                  showNotificationsDropdown 
                    ? "bg-purple-600/20 text-purple-400" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title="Bildirimler"
              >
                <Bell className="h-5 w-5" />
                {messages.some((m) => !m.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {showNotificationsDropdown && (
                <>
                  {/* Overlay to close the dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotificationsDropdown(false)}
                  />
                  
                  {/* Notification Dropdown Panel */}
                  <div className="fixed sm:absolute top-16 sm:top-auto left-4 right-4 sm:left-auto sm:right-0 mt-2.5 w-auto sm:w-[340px] bg-[#11121d] border border-white/10 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-left">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                          BİLDİRİMLER ({messages.filter((m) => !m.read).length})
                        </span>
                      </div>
                      {messages.some((m) => !m.read) && (
                        <button
                          onClick={() => {
                            handleMarkAllMessagesRead();
                            setShowNotificationsDropdown(false);
                          }}
                          className="text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest cursor-pointer transition"
                        >
                          Tümünü Oku
                        </button>
                      )}
                    </div>

                    <div className="max-h-[280px] overflow-y-auto custom-scrollbar division-y divide-white/5">
                      {messages.filter((m) => !m.read).length === 0 ? (
                        <div className="p-6 text-center text-gray-500 space-y-2">
                          <Bell className="h-6 w-6 mx-auto text-gray-600" />
                          <p className="text-[10px] font-bold uppercase tracking-wider">OKUNMAMIŞ BİLDİRİM YOK</p>
                          <p className="text-[9px] text-gray-600 normal-case leading-relaxed">
                            Gelen kutunuzdaki tüm iletişim formları okundu olarak işaretlenmiş.
                          </p>
                        </div>
                      ) : (
                        messages
                          .filter((m) => !m.read)
                          .slice(0, 4)
                          .map((msg) => (
                            <button
                              key={msg.id}
                              onClick={() => {
                                handleToggleMessageRead(msg.id);
                                setSelectedMessageId(msg.id);
                                handleTabChange("inbox");
                                setShowNotificationsDropdown(false);
                                showToast(`${msg.name} adlı kullanıcıdan gelen mesaj açıldı.`, "info");
                              }}
                              className="w-full p-3.5 hover:bg-white/5 flex flex-col space-y-1 transition text-left cursor-pointer border-b border-white/5 last:border-0"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[10px] font-extrabold text-white uppercase tracking-wide truncate">
                                  ✉️ {msg.name}
                                </span>
                                <span className="text-[8px] font-mono font-bold text-gray-500 uppercase shrink-0">
                                  {msg.date}
                                </span>
                              </div>
                              <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed">
                                {msg.message}
                              </p>
                            </button>
                          ))
                      )}
                    </div>

                    <button
                      onClick={() => {
                        handleTabChange("inbox");
                        setShowNotificationsDropdown(false);
                      }}
                      className="w-full py-3 bg-[#0d0e16] hover:bg-[#141525] text-center text-[10px] font-black text-purple-400 uppercase tracking-widest border-t border-white/5 transition block cursor-pointer"
                    >
                      Gelen Kutusuna Git →
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-5 w-px bg-white/10" />

            {/* Logout/Çıkış Button */}
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-red-500 hover:text-red-400 transition border border-red-500/20 cursor-pointer uppercase tracking-wider bg-red-500/5 hover:bg-red-500/10"
              title="Kapat"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Workspace */}
        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[#0c0d16] text-white"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="flex-1"
            >
            {/* Section Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-5 border-white/5">
              <h2 className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 text-white">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0 bg-purple-500" />
                {activeSubTab === "dashboard" && "Genel Bakış"}
                {activeSubTab === "profile" && "Site Profilini Düzenle"}
                {activeSubTab === "settings" && "Sistem & CS2 Oyun Ayarları"}
                {activeSubTab === "integrations" && "Discord & Webhook Entegrasyon Merkezi"}
                {activeSubTab === "inbox" && `Gelen Mesaj Kutusu (${messages.length})`}
                {activeSubTab === "users" && `Kayıtlı Üye Listesi (${registeredUsers.length})`}
                {activeSubTab === "stream" && "Canlı Yayın & Simülasyon Kontrolü"}
                {activeSubTab === "crosshairs" && "Crosshair Kod Listesi & Galerisi"}
                {activeSubTab === "playlists" && "YouTube Oynatma Listesi Yönetimi"}
                {activeSubTab === "specs" && "Sistem Donanım & Ekipman Özellikleri Yönetimi"}
                {activeSubTab === "announcements" && "Duyuru Paneli Yönetimi"}
                {activeSubTab === "giveaways" && "İnteraktif Çekiliş Yönetim Merkezi"}
              </h2>
            </div>

            {/* Notification alert banner */}
            {savedSuccess && (
              <div className="mb-5 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Check className="h-4 w-4 shrink-0" />
                <span>Değişiklikler başarıyla kaydedildi!</span>
              </div>
            )}

            {/* Tab: Dashboard Overview */}
            {activeSubTab === "dashboard" && (
              <div className="space-y-6 text-gray-200 font-sans">
                {/* 4 Colored stats widgets (Cyan, Green, Yellow, Red) styled beautifully as dark glassmorphic panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Stat 1: Cyan (Toplam Kullanıcı) */}
                  <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 text-cyan-400 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-4 right-4 text-cyan-500/10 group-hover:text-cyan-500/15 transition-all duration-300">
                      <Users className="h-16 w-16" />
                    </div>
                    <div className="p-6 relative z-10">
                      <span className="text-4xl font-extrabold tracking-tight block text-cyan-300">
                        {registeredUsers.length}
                      </span>
                      <span className="text-sm font-semibold tracking-wide block mt-1 text-cyan-400/80 uppercase">
                        Toplam Kullanıcı
                      </span>
                    </div>
                    <button 
                      onClick={() => handleTabChange("users")}
                      className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 py-2.5 px-6 text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer border-t border-cyan-500/20"
                    >
                      <span>Detaylar</span>
                      <span className="text-[10px]">➔</span>
                    </button>
                  </div>

                  {/* Stat 2: Green (Toplam Menü) */}
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 text-emerald-400 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-4 right-4 text-emerald-500/10 group-hover:text-emerald-500/15 transition-all duration-300">
                      <Target className="h-16 w-16" />
                    </div>
                    <div className="p-6 relative z-10">
                      <span className="text-4xl font-extrabold tracking-tight block text-emerald-300">
                        {crosshairs.length}
                      </span>
                      <span className="text-sm font-semibold tracking-wide block mt-1 text-emerald-400/80 uppercase">
                        Toplam Menü (Crosshair)
                      </span>
                    </div>
                    <button 
                      onClick={() => handleTabChange("crosshairs")}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 py-2.5 px-6 text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer border-t border-emerald-500/20"
                    >
                      <span>Detaylar</span>
                      <span className="text-[10px]">➔</span>
                    </button>
                  </div>

                  {/* Stat 3: Yellow/Orange (Galeri Öğesi) */}
                  <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 text-amber-400 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-4 right-4 text-amber-500/10 group-hover:text-amber-500/15 transition-all duration-300">
                      <Image className="h-16 w-16" />
                    </div>
                    <div className="p-6 relative z-10">
                      <span className="text-4xl font-extrabold tracking-tight block text-amber-300">
                        {playlists.length}
                      </span>
                      <span className="text-sm font-semibold tracking-wide block mt-1 text-amber-400/80 uppercase">
                        Galeri Öğesi (YouTube)
                      </span>
                    </div>
                    <button 
                      onClick={() => handleTabChange("playlists")}
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 py-2.5 px-6 text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer border-t border-amber-500/20"
                    >
                      <span>Detaylar</span>
                      <span className="text-[10px]">➔</span>
                    </button>
                  </div>

                  {/* Stat 4: Red (Toplam Rezervasyon) */}
                  <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 text-rose-400 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-4 right-4 text-rose-500/10 group-hover:text-rose-500/15 transition-all duration-300">
                      <Mail className="h-16 w-16" />
                    </div>
                    <div className="p-6 relative z-10">
                      <span className="text-4xl font-extrabold tracking-tight block text-rose-300">
                        {messages.length}
                      </span>
                      <span className="text-sm font-semibold tracking-wide block mt-1 text-rose-400/80 uppercase">
                        Toplam Rezervasyon (Mesajlar)
                      </span>
                    </div>
                    <button 
                      onClick={() => handleTabChange("inbox")}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 py-2.5 px-6 text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer border-t border-rose-500/20"
                    >
                      <span>Detaylar</span>
                      <span className="text-[10px]">➔</span>
                    </button>
                  </div>
                </div>

                {/* Smaller Status Card Row (4 sleek dark panels) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {/* Card 1: Bugünün Rezervasyonları */}
                  <div className="bg-[#11121d] rounded-xl border border-white/5 p-4 flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Bugünün Rezervasyonları</span>
                      <span className="text-lg font-black text-white mt-1.5 block">0</span>
                    </div>
                  </div>

                  {/* Card 2: Menüler */}
                  <div className="bg-[#11121d] rounded-xl border border-white/5 p-4 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                      <Radio className={`h-5 w-5 ${isStreamLive ? "animate-pulse" : ""}`} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Aktif Menüler (Yayın)</span>
                      <span className="text-lg font-black text-white mt-1.5 block">
                        {isStreamLive ? "CANLI" : "OFFLINE"}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Toplam Sayfa */}
                  <div className="bg-[#11121d] rounded-xl border border-white/5 p-4 flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Toplam Sayfa (Donanım)</span>
                      <span className="text-lg font-black text-white mt-1.5 block">{systemSpecs.length}</span>
                    </div>
                  </div>

                  {/* Card 4: Ziyaretçi Sayacı */}
                  <div className="bg-[#11121d] rounded-xl border border-white/5 p-4 flex items-center space-x-4">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Ziyaretçi Sayacı</span>
                      <span className="text-lg font-black text-white mt-1.5 block">{visitorCount.toLocaleString("tr-TR")}</span>
                    </div>
                  </div>
                </div>

                {/* 3 Panels with Colored Header ribbons styled in premium glassmorphic dark mode */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  {/* Ribbon 1: Yaklaşan Rezervasyonlar (Teal Header) */}
                  <div className="bg-[#11121d] rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="bg-cyan-500/10 border-b border-cyan-500/20 text-cyan-400 px-4 py-3.5 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4.5 w-4.5" />
                        <span>Yaklaşan Rezervasyonlar</span>
                      </div>
                      <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2.5 py-0.5 rounded-full font-black font-mono">0</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center items-center text-center text-gray-400 text-xs py-10">
                      <p className="font-semibold">Planlanan veya yaklaşan bir rezervasyon bulunamadı.</p>
                    </div>
                  </div>

                  {/* Ribbon 2: Okunmamış Mesajlar (Yellow/Orange Header) */}
                  <div className="bg-[#11121d] rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 px-4 py-3.5 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4.5 w-4.5" />
                        <span>Okunmamış Mesajlar</span>
                      </div>
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-black font-mono">
                        {messages.filter(m => !m.read).length}
                      </span>
                    </div>
                    <div className="p-4 flex-1 space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar">
                      {messages.filter(m => !m.read).length === 0 ? (
                        <div className="text-center text-gray-400 text-xs py-10 font-semibold">
                          Tüm mesajlar okundu!
                        </div>
                      ) : (
                        messages.filter(m => !m.read).slice(0, 3).map((msg) => (
                          <div 
                            key={msg.id}
                            onClick={() => handleTabChange("inbox")}
                            className="p-3 rounded-xl bg-[#161825] border border-white/5 hover:border-amber-500/25 hover:bg-[#1b1e2e] transition cursor-pointer text-left animate-fade-in"
                          >
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                              <span className="text-amber-400">{msg.name}</span>
                              <span>{msg.date || "Yeni"}</span>
                            </div>
                            <p className="text-xs text-gray-300 truncate mt-1">{msg.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Ribbon 3: Onay Bekleyen Rezervasyonlar (Red Header) */}
                  <div className="bg-[#11121d] rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="bg-rose-500/10 border-b border-rose-500/20 text-rose-400 px-4 py-3.5 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4.5 w-4.5" />
                        <span>Onay Bekleyenler</span>
                      </div>
                      <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2.5 py-0.5 rounded-full font-black font-mono">0</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center items-center text-center text-gray-400 text-xs py-10">
                      <p className="font-semibold">Onay bekleyen kayıt veya işlem bulunmuyor.</p>
                    </div>
                  </div>
                </div>

                {/* Kick API & Stream Simulation Section */}
                <div className="p-6 rounded-xl bg-[#11121d] border border-white/5 shadow-sm space-y-6 mt-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${isStreamLive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">
                          Yayın Durumu & Kick API Entegrasyonu
                        </span>
                      </div>
                      <h3 className="font-display text-base font-extrabold text-white uppercase tracking-wider">
                        Otomatik Kick API Simülasyonu
                      </h3>
                      <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                        Kick API kanallarını otomatik dinleyen arka plan servisini aktifleştirin. API etkinleştirildiğinde harici yayın durumunuza göre canlı göstergesi otomatik tetiklenir ve izleyici sayısı dalgalanır.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {!kickApiEnabled && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextLive = !isStreamLive;
                            setIsStreamLive(nextLive);
                            if (nextLive) {
                              triggerWebhook("stream_live", {
                                streamTitle: streamTitle || "Counter-Strike 2 Rekabetçi Maçlar & Topluluk Çekilişi",
                                streamUrl: "https://kick.com/weew"
                              });
                            }
                            showToast(
                              nextLive 
                                ? "Yayın başarıyla başlatıldı! Şu an CANLI (LIVE) yayındasınız." 
                                : "Yayın durduruldu. Çevrimdışı (OFFLINE) moda geçildi.",
                              nextLive ? "success" : "info"
                            );
                          }}
                          className={`rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition duration-300 cursor-pointer ${
                            isStreamLive 
                              ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_12px_rgba(220,38,38,0.2)]" 
                              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                          }`}
                        >
                          {isStreamLive ? "MANUEL YAYINI KAPAT" : "MANUEL YAYINI BAŞLAT"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (onToggleKickApi) {
                            const nextState = !kickApiEnabled;
                            onToggleKickApi(nextState);
                            showToast(
                              nextState 
                                ? "Otomatik Kick API senkronizasyonu etkinleştirildi! Arka plan istekleri başladı." 
                                : "API Entegrasyon simülasyonu kapatıldı. Manuel denetim aktif.",
                              nextState ? "success" : "info"
                            );
                          }
                        }}
                        className={`rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition duration-300 cursor-pointer border ${
                          kickApiEnabled 
                            ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-sm" 
                            : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {kickApiEnabled ? "⚡ API SENKRONİZASYONU: AKTİF" : "🔌 API SENKRONİZASYONU BAŞLAT"}
                      </button>
                    </div>
                  </div>

                  {kickApiEnabled && (
                    <div className="relative z-10 border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Simülasyon Araçları:</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onSaveStreamViewers) {
                                onSaveStreamViewers("1850");
                                showToast("Simüle Edilen API: Ani izleyici patlaması (+450 izleyici) tetiklendi!", "success");
                              }
                            }}
                            className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/25 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition cursor-pointer"
                          >
                            📈 İzleyici Patlaması (+450)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsStreamLive(false);
                              if (onToggleKickApi) {
                                onToggleKickApi(false);
                              }
                              showToast("API Entegrasyonu: Yayın bağlantı kesintisi simüle edildi. Sistem otomatik OFFLINE moduna düştü!", "error");
                            }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition cursor-pointer"
                          >
                            💥 Bağlantı Kesintisi (Crash)
                          </button>
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider animate-pulse font-mono">
                        ● API VERİLERİ HER 4 SANİYEDE BİR OTO-SORGULANIYOR
                      </span>
                    </div>
                  )}

                  {/* Terminal Log Console */}
                  <div className="rounded-xl border border-white/5 bg-black/40 overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/60 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-500/80" />
                          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                          <span className="h-2 w-2 rounded-full bg-green-500/80" />
                        </div>
                        <span>kick-api-polling-service.log</span>
                      </div>
                      <span className="text-emerald-400 animate-pulse font-black font-mono">LIVE MONITOR</span>
                    </div>
                    <div className="p-3 sm:p-4 h-[120px] overflow-y-auto font-mono text-[10px] sm:text-xs text-emerald-400 space-y-1 custom-scrollbar">
                      {kickApiLogs && kickApiLogs.length > 0 ? (
                        kickApiLogs.map((log, idx) => (
                          <div 
                            key={idx} 
                            className={`leading-normal truncate ${
                              log.includes("kesintisi") || log.includes("durum") || log.includes("kapatıldı") || log.includes("durduruldu") || log.includes("SYSTEM")
                                ? "text-purple-400" 
                                : log.includes("200 OK") 
                                ? "text-green-400 font-bold" 
                                : "text-gray-300"
                            }`}
                          >
                            {log}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">Simülatör logları bekleniyor...</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visitor Counter & Notification Control Center */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Browser Notifications Control */}
                  <div className="p-6 rounded-xl bg-[#11121d] border border-white/5 shadow-sm space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold mb-1">
                        🔔 MASAÜSTÜ BİLDİRİM SİSTEMİ
                      </span>
                      <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                        Canlı Yayın Bildirim Ayarları
                      </h3>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                        Yayıncı canlı yayına başladığında tarayıcınızda anlık 'Canlı Yayına Girdi' bildirimi gönderilmesini kontrol edin.
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onToggleNotifications) {
                            onToggleNotifications();
                          }
                        }}
                        className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition duration-300 cursor-pointer ${
                          notificationsEnabled 
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm" 
                            : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                        }`}
                      >
                        {notificationsEnabled ? "🔔 BİLDİRİMLER: AÇIK" : "🔕 BİLDİRİMLER: KAPALI"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                            try {
                              new Notification("Test Bildirimi 🔔", {
                                body: "Yayın bildirim sistemi aktif! Canlı yayınlar başladığında bu şekilde bilgilendirileceksiniz.",
                                icon: profile.profilePhoto || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"
                              });
                              showToast("Test bildirimi başarıyla gönderildi!", "success");
                            } catch (err) {
                              showToast("Masaüstü bildirimi gönderilemedi. Iframe içerisinde olabilirsiniz.", "info");
                            }
                          } else {
                            showToast("Lütfen önce bildirimleri açarak izin verin.", "error");
                          }
                        }}
                        className="text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest transition cursor-pointer"
                      >
                        ⚡ TEST BİLDİRİMİ GÖNDER
                      </button>
                    </div>
                  </div>

                  {/* Visitor Counter Control */}
                  <div className="p-6 rounded-xl bg-[#11121d] border border-white/5 shadow-sm space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold mb-1">
                        👁️ ZİYARETÇİ SAYACI YÖNETİMİ
                      </span>
                      <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                        Tekil Ziyaretçi Sayacı
                      </h3>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                        Sitenize gelen tekil ziyaretçi sayısını simüle edin veya başlangıç sayısını değiştirin.
                      </p>
                    </div>

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
                        className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (onSaveVisitorCount) {
                            onSaveVisitorCount(visitorCount + 100);
                            showToast("Sayaca +100 tekil ziyaretçi eklendi!", "success");
                          }
                        }}
                        className="rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs px-3 font-bold transition cursor-pointer border border-amber-500/25"
                      >
                        +100
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSaveVisitorCount) {
                            onSaveVisitorCount(visitorCount + 1000);
                            showToast("Sayaca +1,000 tekil ziyaretçi eklendi!", "success");
                          }
                        }}
                        className="rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-3 font-bold transition cursor-pointer border border-transparent"
                      >
                        +1K
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rapid System Utilities & Stream Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Stream Title Customizer */}
                  <div className="p-6 rounded-xl bg-[#11121d] border border-white/5 shadow-sm space-y-4">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">
                      YAYIN PARAMETRE AYARLARI
                    </span>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Yayın Başlığı (Simulated Stream Title)
                        </label>
                        <input
                          type="text"
                          value={streamTitle}
                          onChange={(e) => onSaveStreamTitle(e.target.value)}
                          placeholder="Örn: Rekabetçi Maçlar & Topluluk Yayını"
                          className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                            Kategori (Game)
                          </label>
                          <input
                            type="text"
                            value={streamCategory}
                            onChange={(e) => onSaveStreamCategory(e.target.value)}
                            placeholder="Counter-Strike 2"
                            className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                            İzleyiciler
                          </label>
                          <input
                            type="text"
                            value={streamViewers}
                            onChange={(e) => onSaveStreamViewers(e.target.value)}
                            placeholder="1400"
                            className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick System Utilities */}
                  <div className="p-6 rounded-xl bg-[#11121d] border border-white/5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold mb-1">
                        HIZLI SİSTEM ARAÇLARI
                      </span>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Sitenizin düzgün çalıştığını test etmek için gelen kutusuna otomatik olarak rastgele kullanıcı mesajları ekleyebilir veya tüm bilgileri sıfırlayabilirsiniz.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleGenerateMockMessage}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-xs text-purple-400 font-bold py-2.5 transition cursor-pointer"
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span>Mesaj Üret</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Tüm mesajlaşma geçmişini ve kayıtları varsayılana sıfırlamak istiyor musunuz?")) {
                            localStorage.removeItem("weew_messages");
                            loadMessages();
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs text-rose-400 font-bold py-2.5 transition cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 shrink-0" />
                        <span>Sıfırla</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Backup & Restore Panel */}
                <div className="p-6 rounded-xl bg-[#11121d] border border-white/5 shadow-sm space-y-4 mt-6">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold mb-1">
                      💾 PORTAL VERİ SİSTEMİ YEDEKLEME & RESTORE
                    </span>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Tüm Site Ayarlarını Yedekle veya Geri Yükle
                    </h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                      Profil resminiz, sosyal medya linkleriniz, donanım özellikleriniz (specs), duyurularınız, nişangahlarınız (crosshairs), YouTube çalma listeleriniz ve tüm site ayarlarınızı tek tıkla JSON dosyası olarak yedekleyin.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold uppercase tracking-wider text-white py-3 transition shadow-sm cursor-pointer"
                    >
                      <Download className="h-4 w-4 shrink-0" />
                      <span>Yedek Al (Export)</span>
                    </button>

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
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 py-3 transition cursor-pointer"
                      >
                        <Upload className="h-4 w-4 text-gray-500 shrink-0" />
                        <span>Yükle (Import JSON)</span>
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

            {/* Tab: Integrations & Webhooks */}
            {activeSubTab === "integrations" && (
              <WebhookIntegrationsPanel showToast={showToast} />
            )}

            {/* Tab: Message Inbox */}
            {activeSubTab === "inbox" && (
              <div className="space-y-5">
                {/* Header Actions / Stats Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#11121d] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                        İLETİŞİM GELEN KUTUSU
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Toplam <span className="text-white font-black">{messages.length}</span> mesaj | <span className="text-purple-400 font-black">{messages.filter(m => !m.read).length}</span> okunmamış mesaj var.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
                    {messages.length > 0 && (
                      <button
                        onClick={handleMarkAllMessagesRead}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-[#0e0f1a] hover:bg-white/5 text-gray-400 hover:text-white px-3.5 py-2 text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                        title="Tümünü Okundu Yap"
                      >
                        <CheckCheck className="h-3.5 w-3.5 text-purple-400" />
                        Tümünü Oku
                      </button>
                    )}
                    <button
                      onClick={handleGenerateMockMessage}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Test Mesajı
                    </button>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-16 bg-[#11121d] border border-white/5 rounded-3xl flex flex-col items-center">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 mb-3 border border-white/5">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-wider">Gelen kutunuz boş</p>
                    <p className="text-xs text-gray-500 mt-1">İletişim formundan gönderilen izleyici mesajları burada listelenir.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Pane: Message List */}
                    <div className="lg:col-span-5 space-y-3">
                      {/* Search & Filter bar */}
                      <div className="bg-[#11121d] p-3 rounded-2xl border border-white/5 space-y-2.5">
                        <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                          <input
                            type="text"
                            value={inboxSearch}
                            onChange={(e) => setInboxSearch(e.target.value)}
                            placeholder="Mesajlarda ara (isim, e-posta, içerik)..."
                            className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#090a12] border border-white/5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                          />
                        </div>
                        {/* Filter pills */}
                        <div className="flex gap-1.5 border-t border-white/5 pt-2">
                          {(["all", "unread", "read"] as const).map((filter) => (
                            <button
                              key={filter}
                              onClick={() => {
                                setInboxFilter(filter);
                                setSelectedMessageId(null);
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition cursor-pointer border ${
                                inboxFilter === filter
                                  ? "bg-purple-600 border-purple-500 text-white"
                                  : "bg-[#090a12] border-white/5 text-gray-500 hover:text-white"
                              }`}
                            >
                              {filter === "all" ? "Tümü" : filter === "unread" ? "Okunmamış" : "Okunmuş"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable List */}
                      <div className="space-y-2 max-h-[45vh] overflow-y-auto custom-scrollbar pr-1">
                        {(() => {
                          const filtered = messages.filter(msg => {
                            const matchesSearch = 
                              msg.name.toLowerCase().includes(inboxSearch.toLowerCase()) || 
                              msg.email.toLowerCase().includes(inboxSearch.toLowerCase()) || 
                              msg.message.toLowerCase().includes(inboxSearch.toLowerCase());
                            if (inboxFilter === "unread") return matchesSearch && !msg.read;
                            if (inboxFilter === "read") return matchesSearch && msg.read;
                            return matchesSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="text-center py-8 bg-[#11121d]/40 rounded-2xl border border-dashed border-white/5 text-gray-500">
                                <span className="text-[10px] font-bold uppercase tracking-wider block">Mesaj bulunamadı</span>
                                <p className="text-[9px] text-gray-600 mt-0.5">Arama veya filtre kriterlerinizi değiştirin.</p>
                              </div>
                            );
                          }

                          return filtered.map((msg) => {
                            const isSelected = selectedMessageId === msg.id;
                            const isUnread = !msg.read;
                            return (
                              <div
                                key={msg.id}
                                onClick={() => {
                                  setSelectedMessageId(msg.id);
                                  if (isUnread) handleToggleMessageRead(msg.id);
                                }}
                                className={`p-3.5 rounded-2xl text-left border cursor-pointer relative transition duration-200 group ${
                                  isSelected
                                    ? "bg-[#18152c] border-purple-500 shadow-md shadow-purple-600/10"
                                    : "bg-[#11121d] border-white/5 hover:border-white/10 hover:bg-[#151727]"
                                }`}
                              >
                                {isUnread && (
                                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
                                )}
                                <div className="pr-5">
                                  <div className="flex justify-between items-start gap-2 mb-1">
                                    <span className="text-xs font-black text-white uppercase tracking-tight block truncate max-w-[150px]">
                                      {msg.name}
                                    </span>
                                    <span className="text-[9px] font-mono text-gray-500 font-bold shrink-0">
                                      {msg.date.split(" ")[0]}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-purple-400 font-mono block truncate mb-1.5">
                                    {msg.email}
                                  </span>
                                  <p className="text-[11px] text-gray-400 font-semibold line-clamp-1 leading-normal">
                                    {msg.message}
                                  </p>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Right Pane: Message Detail View */}
                    <div className="lg:col-span-7 h-full">
                      {(() => {
                        const selectedMsg = messages.find(m => m.id === selectedMessageId);
                        if (!selectedMsg) {
                          return (
                            <div className="h-[350px] flex flex-col items-center justify-center bg-[#11121d] border border-white/5 rounded-2xl p-6 text-center">
                              <div className="h-14 w-14 rounded-2xl bg-[#090a12] border border-white/5 flex items-center justify-center text-purple-500/40 mb-3 shadow-inner">
                                <MailOpen className="h-6 w-6" />
                              </div>
                              <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider block">OKUMAK İÇİN BİR MESAJ SEÇİN</span>
                              <p className="text-[10px] text-gray-600 font-semibold mt-1">Sol listeden tıklayarak mesaj detaylarını görüntüleyebilir ve yanıtlayabilirsiniz.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="bg-[#11121d] border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden flex flex-col text-left">
                            {/* Decorative ambient background */}
                            <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                            
                            {/* Detail Header */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b border-white/5 pb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center shrink-0">
                                  {selectedMsg.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-sm font-extrabold text-white uppercase tracking-tight block truncate">
                                    {selectedMsg.name}
                                  </span>
                                  <a 
                                    href={`mailto:${selectedMsg.email}`}
                                    className="text-[11px] text-purple-400 font-mono hover:underline inline-flex items-center gap-1"
                                  >
                                    {selectedMsg.email}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[10px] text-gray-500 font-bold uppercase shrink-0">
                                <span>{selectedMsg.date}</span>
                              </div>
                            </div>

                            {/* Status Control */}
                            <div className="flex justify-between items-center bg-[#090a12]/70 px-3.5 py-2.5 rounded-xl border border-white/5">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">MESAJ OKUMA DURUMU</span>
                              <button
                                onClick={() => handleToggleMessageRead(selectedMsg.id)}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition cursor-pointer border ${
                                  selectedMsg.read 
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                    : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                }`}
                              >
                                {selectedMsg.read ? "Okundu Olarak İşaretli" : "Okunmadı Olarak İşaretli"}
                              </button>
                            </div>

                            {/* Message Body Container */}
                            <div className="bg-[#090a12] p-4.5 rounded-2xl border border-white/5 min-h-[140px] relative">
                              <span className="absolute top-3.5 right-3.5 text-[8px] font-mono text-gray-600 font-black uppercase">// MESAJ İÇERİĞİ</span>
                              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium whitespace-pre-wrap pt-3">
                                {selectedMsg.message}
                              </p>
                            </div>

                            {/* Actions Footer */}
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
                              <div className="flex gap-2">
                                <a
                                  href={`mailto:${selectedMsg.email}?subject=Re: weew Portal İletişim`}
                                  className="flex-1 sm:flex-none h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                  Cevapla (Reply)
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedMsg.message);
                                    showToast("Mesaj metni panoya kopyalandı!", "success");
                                  }}
                                  className="h-9 px-3.5 rounded-xl border border-white/5 bg-[#090a12] hover:bg-white/5 text-gray-400 hover:text-white font-black text-xs uppercase tracking-wider transition cursor-pointer inline-flex items-center justify-center"
                                  title="Panoya Kopyala"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(selectedMsg.id)}
                                className="h-9 px-4 rounded-xl bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Mesajı Kalıcı Olarak Sil
                              </button>
                            </div>

                          </div>
                        );
                      })()}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Tab: Users list */}
            {activeSubTab === "users" && (
              <div className="space-y-5">
                {/* Registration Control Switcher card */}
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                          KAYIT OLMA ÖZELLİĞİ KONTROLÜ
                        </h4>
                        <p className="text-[11px] text-gray-400 font-medium leading-normal mt-0.5">
                          Portal dışı ziyaretçilerin sisteme yeni üyelik oluşturmasını anlık olarak kapatıp açabilirsiniz.
                        </p>
                      </div>
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
                      {isRegistrationDisabled ? "KAYITLARI AKTİFLEŞTİR" : "KAYITLARI DEVRE DIŞI BIRAK"}
                    </button>
                  </div>
                  
                  <div className="text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 pt-3 border-t border-white/5">
                    <span>Kayıt Durumu:</span>
                    {isRegistrationDisabled ? (
                      <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded animate-pulse">
                        🔴 Yeni Üye Kayıtları Kilitlendi (Closed)
                      </span>
                    ) : (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        🟢 Kayıtlar Aktif ve Herkese Açık (Open)
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Stats Panel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                  <div className="p-4 rounded-2xl bg-[#11121d] border border-white/5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">TOPLAM ÜYE</span>
                    <span className="text-lg font-black text-white">{registeredUsers.length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#11121d] border border-white/5">
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block mb-1">YÖNETİCİ (ADMIN)</span>
                    <span className="text-lg font-black text-purple-400">{registeredUsers.filter(u => u.role === "admin").length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#11121d] border border-white/5">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">İZLEYİCİ / ÜYE</span>
                    <span className="text-lg font-black text-gray-300">{registeredUsers.filter(u => u.role === "user").length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#11121d] border border-white/5">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block mb-1">KURUCU</span>
                    <span className="text-lg font-black text-amber-400">1</span>
                  </div>
                </div>

                {/* Protected Founder Warning banner */}
                <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-[11px] text-purple-300 leading-normal font-semibold uppercase tracking-wide flex items-center gap-2 text-left">
                  <AlertCircle className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>
                    <strong className="font-extrabold text-white">Kurucu Hakları Korunuyor:</strong> <code className="text-purple-300 font-bold bg-white/5 px-1 py-0.5 rounded text-[10px]">iremsaltanat002001@gmail.com</code> kurucu statüsü sistem tarafından kilitlenmiştir.
                  </span>
                </div>

                {/* Filters and Search Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 bg-[#11121d] p-3 rounded-2xl border border-white/5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Üye adı veya e-posta ile ara..."
                      className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#090a12] border border-white/5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition font-medium"
                    />
                  </div>
                  
                  <div className="flex gap-1.5 shrink-0">
                    {(["all", "admin", "user"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setUserRoleFilter(role)}
                        className={`px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-wider transition border cursor-pointer inline-flex items-center ${
                          userRoleFilter === role
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-[#090a12] border-white/5 text-gray-500 hover:text-white"
                        }`}
                      >
                        {role === "all" ? "Tüm Üyeler" : role === "admin" ? "Sadece Adminler" : "Sadece İzleyiciler"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Members Table */}
                <div className="rounded-2xl border border-white/5 overflow-hidden bg-black/20 text-left">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                          <th className="p-4">Kullanıcı Bilgisi</th>
                          <th className="p-4">Katılım Tarihi</th>
                          <th className="p-4">Rol / Yetki</th>
                          <th className="p-4 text-center">Yetki Yönetimi</th>
                          <th className="p-4 text-right">Eylemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-semibold">
                        {(() => {
                          const filtered = registeredUsers.filter(u => {
                            const matchesSearch = 
                              u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                              u.email.toLowerCase().includes(userSearch.toLowerCase());
                            if (userRoleFilter === "admin") return matchesSearch && u.role === "admin";
                            if (userRoleFilter === "user") return matchesSearch && u.role === "user";
                            return matchesSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                  <Users className="h-8 w-8 text-gray-600 mx-auto mb-2 animate-pulse" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider block">Kullanıcı bulunamadı</span>
                                  <p className="text-[9px] text-gray-600 mt-0.5">Farklı bir arama kelimesi veya filtre seçmeyi deneyin.</p>
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((u) => {
                            const isPrimaryAdmin = u.email === "iremsaltanat002001@gmail.com";
                            const firstLetter = u.name.charAt(0).toUpperCase();
                            
                            return (
                              <tr key={u.email} className="hover:bg-white/5 transition">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center shrink-0">
                                      {firstLetter}
                                    </div>
                                    <div className="min-w-0">
                                      <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight block truncate">
                                        {u.name}
                                      </span>
                                      <span className="text-[10px] text-gray-500 font-mono block">
                                        {u.email}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-400 font-mono text-[10px]">
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }) : "-"}
                                </td>
                                <td className="p-4">
                                  {isPrimaryAdmin ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                                      <Award className="h-3.5 w-3.5" />
                                      <span>KURUCU ADMIN</span>
                                    </span>
                                  ) : u.role === "admin" ? (
                                    <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                                      ADMIN
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-gray-400 border border-white/5">
                                      ÜYE / İZLEYİCİ
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  {isPrimaryAdmin ? (
                                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest italic font-bold">TAM YETKİ</span>
                                  ) : (
                                    <div className="inline-flex rounded-xl bg-[#090a12] p-1 border border-white/5">
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateUserRole(u.email, "user")}
                                        className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition cursor-pointer ${
                                          u.role === "user"
                                            ? "bg-white/5 text-gray-300"
                                            : "text-gray-500 hover:text-white"
                                        }`}
                                      >
                                        Üye Yap
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateUserRole(u.email, "admin")}
                                        className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition cursor-pointer ${
                                          u.role === "admin"
                                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/10"
                                            : "text-gray-500 hover:text-purple-400"
                                        }`}
                                      >
                                        Yönetici Yap
                                      </button>
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  {isPrimaryAdmin ? (
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest italic">Korumalı</span>
                                  ) : (
                                    <button
                                      onClick={() => handleDeleteUser(u.email)}
                                      className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white inline-flex items-center justify-center transition border border-red-500/20 cursor-pointer"
                                      title="Üyeliği Kaldır"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
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
                    onClick={() => {
                      const nextLive = !isStreamLive;
                      setIsStreamLive(nextLive);
                      if (nextLive) {
                        triggerWebhook("stream_live", {
                          streamTitle: streamTitle || "Counter-Strike 2 Rekabetçi Maçlar & Topluluk Çekilişi",
                          streamUrl: "https://kick.com/weew"
                        });
                      }
                      showToast(
                        nextLive 
                          ? "Yayın başarıyla başlatıldı! Şu an CANLI (LIVE) yayındasınız." 
                          : "Yayın durduruldu. Çevrimdışı (OFFLINE) moda geçildi.",
                        nextLive ? "success" : "info"
                      );
                    }}
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


            {/* Tab: Giveaway Management */}
            {activeSubTab === "giveaways" && (
              <div className="space-y-6">
                
                {/* Upper action row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#11121d] p-4 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-extrabold uppercase tracking-widest block mb-0.5">SİSTEM KONTROLÜ</span>
                    <h3 className="text-xs text-gray-400 font-semibold">
                      İnteraktif çekilişleri gerçek zamanlı başlatabilir, katılımcıları denetleyebilir ve kazanan belirleyebilirsiniz.
                    </h3>
                  </div>
                  <button
                    onClick={handleResetGiveawaysToDefault}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl border border-white/5 bg-[#0e0f1a] hover:bg-white/5 text-gray-400 hover:text-white px-3 py-2 text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Tümünü Sıfırla
                  </button>
                </div>

                {/* Main dual column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Create Form */}
                  <div className="lg:col-span-5 bg-[#11121d] rounded-2xl border border-white/5 p-5 space-y-4">
                    <div className="flex items-center gap-2 text-purple-400 pb-3 border-b border-white/5">
                      <Plus className="h-4 w-4" />
                      <h4 className="font-display text-xs font-black uppercase tracking-wider">
                        Yeni Çekiliş Başlat
                      </h4>
                    </div>

                    <form onSubmit={handleCreateGiveaway} className="space-y-4">
                      {/* Prize */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Verilecek Ödül (Örn: AK-47 | Redline) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newGiveawayPrize}
                          onChange={(e) => setNewGiveawayPrize(e.target.value)}
                          placeholder="Ödül adını giriniz..."
                          className="w-full h-10 rounded-xl border border-white/5 bg-[#0e0f1a] px-4 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition font-medium"
                        />
                      </div>

                      {/* TR Desc */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Türkçe Açıklama (Opsiyonel)
                        </label>
                        <textarea
                          value={newGiveawayDescTR}
                          onChange={(e) => setNewGiveawayDescTR(e.target.value)}
                          placeholder="Çekiliş detaylarını giriniz..."
                          rows={2}
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition resize-none font-medium"
                        />
                      </div>

                      {/* EN Desc */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          İngilizce Açıklama (Opsiyonel)
                        </label>
                        <textarea
                          value={newGiveawayDescEN}
                          onChange={(e) => setNewGiveawayDescEN(e.target.value)}
                          placeholder="Giveaway details in English..."
                          rows={2}
                          className="w-full rounded-xl border border-white/5 bg-[#0e0f1a] px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition resize-none font-medium"
                        />
                      </div>

                      {/* Duration */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Çekiliş Süresi (Dakika)
                        </label>
                        <select
                          value={newGiveawayDuration}
                          onChange={(e) => setNewGiveawayDuration(e.target.value)}
                          className="w-full h-10 rounded-xl border border-white/5 bg-[#0e0f1a] px-4 text-xs text-white focus:border-purple-500 focus:outline-none transition font-bold"
                        >
                          <option value="5">5 Dakika</option>
                          <option value="10">10 Dakika</option>
                          <option value="30">30 Dakika</option>
                          <option value="60">1 Saat</option>
                          <option value="120">2 Saat</option>
                          <option value="1440">24 Saat</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/15 mt-2"
                      >
                        <Gift className="h-4 w-4" />
                        Çekilişi Yayına Al
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Status & History */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Active Giveaway Card */}
                    <div className="bg-[#11121d] rounded-2xl border border-white/5 p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <h4 className="font-display text-xs font-black uppercase tracking-wider text-white">
                            Aktif Çekiliş Durumu
                          </h4>
                        </div>
                        {giveaways.find(g => g.status === "active") && (
                          <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            AKTİF YAYINDA
                          </span>
                        )}
                      </div>

                      {(() => {
                        const active = giveaways.find(g => g.status === "active");
                        if (!active) {
                          return (
                            <div className="py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/5">
                              <Gift className="h-8 w-8 text-gray-600 mx-auto mb-2 animate-pulse" />
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">YAYINDA AKTİF ÇEKİLİŞ YOK</span>
                              <p className="text-[9px] text-gray-600 font-medium mt-0.5">Soldaki paneli kullanarak yeni bir tane başlatabilirsiniz.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            {/* Prize info */}
                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                              <span className="text-[8px] font-mono text-purple-400 font-black block uppercase tracking-wider mb-1">ÖDÜL</span>
                              <div className="text-sm font-black text-white flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                                {active.prize}
                              </div>
                              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                {active.descriptionTR}
                              </p>
                              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[10px] text-gray-400 font-mono font-bold">
                                <span>Katılımcı: <strong className="text-white">{active.entrants.length}</strong></span>
                                <span>Bitiş: <strong className="text-white">{new Date(active.endTime).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</strong></span>
                              </div>
                            </div>

                            {/* Entrants moderation */}
                            <div className="space-y-2">
                              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Katılımcı Listesi & Kontrolü ({active.entrants.length})
                              </span>

                              {/* Manual Add Entrant Input */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newEntrantName}
                                  onChange={(e) => setNewEntrantName(e.target.value)}
                                  placeholder="Katılımcı kullanıcı adı..."
                                  className="flex-1 h-9 rounded-xl border border-white/5 bg-[#0e0f1a] px-3 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition font-medium"
                                  onKeyDown={(e) => e.key === "Enter" && handleAddManualEntrant(active.id)}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddManualEntrant(active.id)}
                                  className="h-9 px-4 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 font-black text-[10px] uppercase transition cursor-pointer shrink-0"
                                >
                                  Manuel Ekle
                                </button>
                              </div>

                              {/* Simulator helper */}
                              <div className="flex justify-between items-center bg-[#0e0f1a]/80 p-2.5 rounded-xl border border-white/5">
                                <span className="text-[9px] text-gray-500 font-mono font-bold">Sanal katılım simülatörü</span>
                                <button
                                  type="button"
                                  onClick={() => handleAddMockEntrants(active.id)}
                                  className="flex items-center gap-1 bg-[#00e676]/10 hover:bg-[#00e676] text-[#00e676] hover:text-black border border-[#00e676]/20 font-mono text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider transition cursor-pointer"
                                >
                                  <Users className="h-3 w-3" />
                                  +5 İzleyici Gönder
                                </button>
                              </div>

                              {/* Scrollable list of entrants */}
                              {active.entrants.length === 0 ? (
                                <p className="text-[10px] text-gray-600 italic font-mono py-1">Henüz katılan yok.</p>
                              ) : (
                                <div className="max-h-28 overflow-y-auto bg-[#0e0f1a]/50 rounded-xl p-2.5 border border-white/5 custom-scrollbar flex flex-wrap gap-1.5">
                                  {active.entrants.map((ent, idx) => (
                                    <div
                                      key={`${ent}-${idx}`}
                                      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-300 font-bold hover:border-red-500/30 transition group"
                                    >
                                      <span>{ent}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleKickEntrant(active.id, ent)}
                                        className="text-gray-500 hover:text-red-400 transition"
                                        title="Çıkar"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* DRAW & CANCEL CTAs */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                              <button
                                type="button"
                                onClick={() => handleCancelGiveaway(active.id)}
                                className="h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <X className="h-4 w-4" />
                                İptal Et
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdminDrawGiveaway(active.id)}
                                className="h-10 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/15"
                              >
                                <Trophy className="h-4 w-4" />
                                Kazananı Çek!
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Past Giveaways History List */}
                    <div className="bg-[#11121d] rounded-2xl border border-white/5 p-5 space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <Trophy className="h-4 w-4 text-purple-400" />
                        <h4 className="font-display text-xs font-black uppercase tracking-wider text-white">
                          Çekiliş Geçmişi ({giveaways.filter(g => g.status !== "active").length})
                        </h4>
                      </div>

                      {giveaways.filter(g => g.status !== "active").length === 0 ? (
                        <p className="text-[10px] text-gray-500 italic py-2">Henüz tamamlanmış veya iptal edilmiş bir çekiliş kaydı yok.</p>
                      ) : (
                        <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                          {giveaways
                            .filter(g => g.status !== "active")
                            .map((g) => (
                              <div
                                key={g.id}
                                className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-[#0e0f1a] transition gap-4"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                    <span className="text-[9px] font-mono text-gray-500">
                                      {new Date(g.createdAt).toLocaleDateString("tr-TR")}
                                    </span>
                                    {g.status === "cancelled" ? (
                                      <span className="text-[8px] font-mono font-black text-red-400 bg-red-500/10 px-1 rounded uppercase tracking-wider">İptal Edildi</span>
                                    ) : (
                                      <span className="text-[8px] font-mono font-black text-[#00e676] bg-[#00e676]/10 px-1 rounded uppercase tracking-wider">Tamamlandı</span>
                                    )}
                                  </div>
                                  <h5 className="text-[11px] font-black text-white uppercase truncate tracking-wider">{g.prize}</h5>
                                  {g.winner && (
                                    <p className="text-[10px] text-purple-400 font-bold flex items-center gap-1 mt-0.5">
                                      <Award className="h-3 w-3 text-amber-500" />
                                      Kazanan: <span className="text-white underline">{g.winner}</span>
                                    </p>
                                  )}
                                  <p className="text-[9px] text-gray-500 font-bold font-mono mt-0.5">Katılımcı Sayısı: {g.entrants.length}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGiveaway(g.id)}
                                  className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white inline-flex items-center justify-center transition border border-red-500/20 cursor-pointer shrink-0"
                                  title="Sil"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

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

      </div>

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
