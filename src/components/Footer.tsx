import React from "react";
import { Globe } from "lucide-react";
import { TranslationDict } from "../types";

interface FooterProps {
  lang: "TR" | "EN";
  setLang: (lang: "TR" | "EN") => void;
  setActiveSection: (sec: string) => void;
  translations: TranslationDict;
  siteName: string;
  profilePhoto: string;
  kickUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  discordUrl: string;
}

export default function Footer({
  lang,
  setLang,
  setActiveSection,
  translations,
  siteName,
  profilePhoto,
  kickUrl,
  instagramUrl,
  youtubeUrl,
  tiktokUrl,
  discordUrl
}: FooterProps) {
  
  const handleNavClick = (id: string) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 bg-[#07080c] pt-16 pb-10 text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <img 
                src={profilePhoto} 
                alt={`${siteName} Logo`} 
                className="h-9 w-9 rounded-full border border-purple-500/30 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="font-display text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 uppercase">
                {siteName}
              </span>
            </div>
            
            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs uppercase">
              {siteName} – CS2 Yayıncısı & İçerik Üreticisi
            </p>

            {/* Language micro buttons */}
            <div className="flex items-center space-x-2 pt-1" id="footer-lang-buttons">
              <Globe className="h-3.5 w-3.5 text-purple-400" />
              <button
                onClick={() => setLang("TR")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded transition ${
                  lang === "TR" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-gray-400 hover:text-white"
                }`}
              >
                Türkçe 🇹🇷
              </button>
              <button
                onClick={() => setLang("EN")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded transition ${
                  lang === "EN" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-gray-400 hover:text-white"
                }`}
              >
                English 🇺🇸
              </button>
            </div>
          </div>

          {/* Column 2: Menu Directory */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-mono text-purple-400 font-bold tracking-widest block uppercase">
              // MENU
            </span>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <button onClick={() => handleNavClick("home")} className="hover:text-white transition">
                  {translations.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("system")} className="hover:text-white transition">
                  {translations.navSystem}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("about")} className="hover:text-white transition">
                  {translations.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("contact")} className="hover:text-white transition">
                  {translations.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Redirects */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-mono text-purple-400 font-bold tracking-widest block uppercase">
              // {translations.footerSocial}
            </span>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <a href={kickUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Kick
                </a>
              </li>
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  YouTube
                </a>
              </li>
              <li>
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  TikTok
                </a>
              </li>
              <li>
                <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Other */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[10px] font-mono text-purple-400 font-bold tracking-widest block uppercase">
              // {translations.footerOther}
            </span>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>
                <button onClick={() => handleNavClick("about")} className="hover:text-white transition">
                  {lang === "TR" ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions"}
                </button>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition">
                  {lang === "TR" ? "Gizlilik Politikası" : "Privacy Policy"}
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition">
                  {lang === "TR" ? "Kullanım Koşulları" : "Terms of Use"}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright footer credits line */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-500 font-bold uppercase">
          <div>
            © 2026 <span className="uppercase">{siteName}</span> – {translations.footerRights}
          </div>
          <div className="flex items-center space-x-1 tracking-wider text-gray-600">
            <span>WEEW ENGINE v1.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
