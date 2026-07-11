import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe, ChevronDown, Tv, Home, Monitor, User, Mail, LogIn, LogOut, Shield, Settings2, Crosshair, Youtube, Bell, BellOff, Gift, Users } from "lucide-react";
import { TranslationDict } from "../types";
import { UserAccount } from "./AuthModal";

interface HeaderProps {
  lang: "TR" | "EN";
  setLang: (lang: "TR" | "EN") => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  translations: TranslationDict;
  isStreamLive: boolean;
  setIsStreamLive: (live: boolean) => void;
  siteName: string;
  profilePhoto: string;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminPanel: () => void;
  notificationsEnabled?: boolean;
  onToggleNotifications?: () => void;
}

export default function Header({
  lang,
  setLang,
  activeSection,
  setActiveSection,
  translations,
  isStreamLive,
  setIsStreamLive,
  siteName,
  profilePhoto,
  currentUser,
  onLogout,
  onOpenAuthModal,
  onOpenAdminPanel,
  notificationsEnabled = false,
  onToggleNotifications
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [avatarClicks, setAvatarClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const menuItems = [
    { id: "home", label: translations.navHome, icon: Home },
    { id: "giveaway", label: translations.navGiveaway || "Çekiliş", icon: Gift },
    { id: "settings", label: translations.navSettings, icon: Settings2 },
    { id: "crosshair", label: translations.navCrosshair || "Crosshair", icon: Crosshair },
    { id: "playlists", label: translations.playlistsSub || "Listeler", icon: Youtube },
    { id: "system", label: translations.navSystem, icon: Monitor },
    { id: "about", label: translations.navAbout, icon: User },
    { id: "contact", label: translations.navContact, icon: Mail }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAvatarClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 1500) {
      const newClicks = avatarClicks + 1;
      setAvatarClicks(newClicks);
      if (newClicks >= 4) { // 5 total clicks (0, 1, 2, 3, 4)
        onOpenAuthModal();
        setAvatarClicks(0);
      }
    } else {
      setAvatarClicks(1);
    }
    setLastClickTime(now);
    handleNavClick("home");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0b0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl 2xl:max-w-screen-2xl items-center justify-between px-2 sm:px-6 lg:px-8">
        
        {/* Logo and Name */}
        <div 
          onClick={handleAvatarClick} 
          className="flex cursor-pointer items-center space-x-1.5 sm:space-x-3 group shrink-0"
          id="header-logo-container"
          title="Weew Portal"
        >
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full border border-purple-500/30 bg-[#161925] p-0.5 transition group-hover:border-purple-400 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <img 
              src={profilePhoto} 
              alt={`${siteName} Avatar`} 
              className="h-full w-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display text-sm sm:text-lg lg:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 group-hover:brightness-110 uppercase shrink-0">
            {siteName}
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2 mx-2 lg:mx-4 min-w-0 overflow-hidden">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`nav-btn-${item.id}`}
                className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 2xl:px-3 rounded-lg text-xs font-semibold transition duration-200 shrink-0 ${
                  isActive 
                    ? "text-purple-400 font-extrabold" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={item.label}
              >
                <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden 2xl:inline">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Lang, Kick, Auth, Mobile Toggle) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 shrink-0">

          {/* Stream Live Notifications Bell */}
          {currentUser?.role === "admin" && (
            <button
              onClick={onToggleNotifications}
              id="stream-notification-bell-btn"
              className={`flex items-center justify-center rounded-lg border p-1.5 sm:p-2 text-xs transition duration-200 cursor-pointer ${
                notificationsEnabled 
                  ? "bg-[#00e676]/10 border-[#00e676]/30 text-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.2)] hover:bg-[#00e676]/20" 
                  : "border-white/10 bg-[#161925] text-gray-400 hover:border-purple-500/30 hover:text-white"
              }`}
              title={lang === "TR" ? "Canlı Yayın Bildirimlerini Aç/Kapat" : "Toggle Live Stream Notifications"}
            >
              <motion.div
                animate={notificationsEnabled ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
                transition={{ repeat: notificationsEnabled ? Infinity : 0, repeatDelay: 6, duration: 0.6 }}
              >
                {notificationsEnabled ? (
                  <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <BellOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </motion.div>
            </button>
          )}
          
          {/* Language Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              id="lang-dropdown-btn"
              className="flex items-center space-x-0.5 sm:space-x-1 rounded-lg border border-white/10 bg-[#161925] px-1.5 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-gray-300 transition hover:border-purple-500/30 hover:text-white"
            >
              <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-400" />
              <span>{lang}</span>
              <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform hidden xs:inline sm:inline ${isLangDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-1.5 w-24 rounded-lg border border-white/5 bg-[#0e1017] p-1 shadow-xl z-20"
                    id="lang-dropdown-menu"
                  >
                    <button
                      onClick={() => { setLang("TR"); setIsLangDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition ${
                        lang === "TR" ? "bg-purple-500/10 text-purple-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>Türkçe</span>
                      <span>🇹🇷</span>
                    </button>
                    <button
                      onClick={() => { setLang("EN"); setIsLangDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition ${
                        lang === "EN" ? "bg-purple-500/10 text-purple-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>English</span>
                      <span>🇺🇸</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Authentication Controls */}
          <div className="shrink-0">
            {currentUser ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {currentUser.role === "admin" && (
                  <button
                    onClick={onOpenAdminPanel}
                    id="header-admin-panel-btn"
                    className="flex items-center space-x-1 rounded-lg border border-purple-500/40 bg-purple-500/10 px-1.5 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-xs font-black uppercase text-purple-400 tracking-wider transition hover:bg-purple-600 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-pointer"
                  >
                    <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="hidden min-[420px]:inline">PANEL</span>
                  </button>
                )}
                
                <div className="hidden lg:flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wide max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  {currentUser.role === "admin" && (
                    <span className="flex items-center space-x-0.5 rounded px-1.5 py-0.5 text-[8px] font-black tracking-wider bg-red-500/20 border border-red-500/30 text-red-400 uppercase">
                      <Shield className="h-2.5 w-2.5" />
                      <span>ADMIN</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={onLogout}
                  id="header-logout-btn"
                  className="rounded-lg border border-white/5 bg-white/5 p-1 sm:p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Çıkış Yap"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Kick Status Indicator */}
          <button
            onClick={() => {
              if (currentUser?.role === "admin") {
                setIsStreamLive(!isStreamLive);
              } else {
                // If stream is live, let them go straight to the player
                setActiveSection("home");
                setTimeout(() => {
                  const element = document.getElementById("kick-stream");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }, 100);
              }
            }}
            id="kick-live-indicator-btn"
            className={`flex items-center space-x-1 rounded-full px-1.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition duration-300 shrink-0 ${
              isStreamLive 
                ? "bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.2)]" 
                : "bg-gray-800/50 text-gray-400 border border-white/5 hover:bg-gray-800"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isStreamLive ? "bg-[#00e676]" : "bg-gray-500"}`} />
            <span className="hidden min-[360px]:inline">Kick</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="rounded-lg border border-white/10 bg-[#161925] p-1.5 text-gray-400 hover:text-white hover:border-purple-500/30 md:hidden shrink-0"
          >
            {isMobileMenuOpen ? <X className="h-4.5 w-4.5 sm:h-5 sm:w-5" /> : <Menu className="h-4.5 w-4.5 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/5 bg-[#0a0b0f] md:hidden overflow-hidden"
            id="mobile-drawer-menu"
          >
            <div className="space-y-1 px-3 py-4">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      isActive 
                        ? "bg-purple-500/10 text-purple-400" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <IconComponent className="h-4.5 w-4.5 text-purple-400/80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Auth items */}
              <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                {currentUser ? (
                  <>
                    <div className="px-4 py-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                      <span>Uye: {currentUser.name}</span>
                      {currentUser.role === "admin" && (
                        <span className="flex items-center space-x-0.5 rounded px-1.5 py-0.5 text-[8px] font-black tracking-wider bg-red-500/20 border border-red-500/30 text-red-400 uppercase">
                          <Shield className="h-2.5 w-2.5" />
                          <span>ADMIN</span>
                        </span>
                      )}
                    </div>
                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenAdminPanel();
                        }}
                        className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20"
                      >
                        <Shield className="h-4.5 w-4.5" />
                        <span>Admin Paneli</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/5"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      <span>Çıkış Yap</span>
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
