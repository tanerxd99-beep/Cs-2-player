import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe, ChevronDown, Tv, Home, Monitor, User, Mail, LogIn, LogOut, Shield, Settings2, Crosshair } from "lucide-react";
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
  onOpenAdminPanel
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const menuItems = [
    { id: "home", label: translations.navHome, icon: Home },
    { id: "settings", label: translations.navSettings, icon: Settings2 },
    { id: "crosshair", label: translations.navCrosshair || "Crosshair", icon: Crosshair },
    { id: "system", label: translations.navSystem, icon: Monitor },
    { id: "about", label: translations.navAbout, icon: User },
    { id: "contact", label: translations.navContact, icon: Mail }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0b0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Name */}
        <div 
          onClick={() => handleNavClick("home")} 
          className="flex cursor-pointer items-center space-x-3 group"
          id="header-logo-container"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-purple-500/30 bg-[#161925] p-0.5 transition group-hover:border-purple-400 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <img 
              src={profilePhoto} 
              alt={`${siteName} Avatar`} 
              className="h-full w-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 group-hover:brightness-110 uppercase">
            {siteName}
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`nav-btn-${item.id}`}
                className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive 
                    ? "text-purple-400" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.label}</span>
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
        <div className="flex items-center space-x-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              id="lang-dropdown-btn"
              className="flex items-center space-x-1 rounded-lg border border-white/10 bg-[#161925] px-2.5 py-1.5 text-xs font-semibold text-gray-300 transition hover:border-purple-500/30 hover:text-white"
            >
              <Globe className="h-3.5 w-3.5 text-purple-400" />
              <span>{lang}</span>
              <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`} />
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
          {currentUser ? (
            <div className="flex items-center space-x-2">
              {currentUser.role === "admin" && (
                <button
                  onClick={onOpenAdminPanel}
                  id="header-admin-panel-btn"
                  className="flex items-center space-x-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-black uppercase text-purple-400 tracking-wider transition hover:bg-purple-600 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-pointer"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ADMİN PANELİ</span>
                </button>
              )}
              
              <span className="hidden lg:inline text-xs font-bold text-gray-400 uppercase tracking-wide max-w-[100px] truncate">
                {currentUser.name}
              </span>

              <button
                onClick={onLogout}
                id="header-logout-btn"
                className="rounded-lg border border-white/5 bg-white/5 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Çıkış Yap"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              id="header-login-btn"
              className="flex items-center space-x-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-bold text-white uppercase tracking-wider transition shadow-[0_4px_10px_rgba(168,85,247,0.2)] cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>GİRİŞ</span>
            </button>
          )}

          {/* Kick Status Indicator */}
          <button
            onClick={() => {
              setIsStreamLive(!isStreamLive);
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            id="kick-live-indicator-btn"
            className={`flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition duration-300 ${
              isStreamLive 
                ? "bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.2)]" 
                : "bg-gray-800/50 text-gray-400 border border-white/5 hover:bg-gray-800"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isStreamLive ? "bg-[#00e676]" : "bg-gray-500"}`} />
            <span>Kick</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="rounded-lg border border-white/10 bg-[#161925] p-1.5 text-gray-400 hover:text-white hover:border-purple-500/30 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                    <div className="px-4 py-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Uye: {currentUser.name} ({currentUser.role})
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
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold text-purple-400 bg-purple-500/10"
                  >
                    <LogIn className="h-4.5 w-4.5" />
                    <span>Giriş Yap / Kayıt Ol</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
