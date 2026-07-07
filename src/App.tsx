import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
import { TRANSLATIONS } from "./data";

const DEFAULT_PROFILE: UserProfile = {
  siteName: "Weew",
  profilePhoto: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
  bioTR: "Selamlar! Ben Weew. CS2 arenasında rekabetçi maçlar oynayan, güncel taktikleri inceleyen ve ekipman testleri yapan bir yayıncı ve içerik üreticisiyim. Yayınlarımda genellikle yüksek seviyeli Faceit maçları, izleyici lobileri ve topluluk turnuvaları düzenliyorum. Sıkı dostlukların ve eğlencenin olduğu topluluğumuza hoş geldin!",
  bioEN: "Greetings! I am Weew. I am a streamer and content creator who plays competitive matches in the CS2 arena, reviews modern tactics, and tests high-end hardware. My broadcasts usually feature high-level Faceit matches, viewer lobbies, and community tournaments. Welcome to our gaming community!",
  kickUsername: "/weew",
  kickUrl: "https://kick.com/weew",
  instagramUsername: "@weew",
  instagramUrl: "https://instagram.com/weew",
  youtubeUsername: "@weew",
  youtubeUrl: "https://youtube.com/@weew",
  tiktokUsername: "@weew",
  tiktokUrl: "https://tiktok.com/@weew",
  discordUsername: "Sunucuya Katıl",
  discordUrl: "https://discord.gg/weew"
};

export default function App() {
  const [lang, setLang] = useState<"TR" | "EN">("TR");
  const [activeSection, setActiveSection] = useState("home");
  const [isStreamLive, setIsStreamLive] = useState(false);
  
  // Auth & Admin Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
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

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem("weew_user_profile", JSON.stringify(updated));
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
      className="min-h-screen bg-[#08090d] text-gray-100 font-sans grid-bg select-none flex flex-col justify-between"
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
        setIsStreamLive={setIsStreamLive}
        siteName={profile.siteName}
        profilePhoto={profile.profilePhoto}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
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
                setIsStreamLive={setIsStreamLive} 
                siteName={profile.siteName}
                profilePhoto={profile.profilePhoto}
                kickUsername={profile.kickUsername}
                kickUrl={profile.kickUrl}
              />

              {/* YouTube Section */}
              <YouTubeSection translations={translations} />
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
              <CS2SpecsSection translations={translations} />
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
      />

      {/* Auth Modal Component */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
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
            setIsStreamLive={setIsStreamLive}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
