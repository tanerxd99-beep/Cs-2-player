import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Save, Image, User, Link, HelpCircle, Check, Sparkles } from "lucide-react";

export interface UserProfile {
  siteName: string;
  profilePhoto: string;
  bioTR: string;
  bioEN: string;
  kickUsername: string;
  kickUrl: string;
  instagramUsername: string;
  instagramUrl: string;
  youtubeUsername: string;
  youtubeUrl: string;
  tiktokUsername: string;
  tiktokUrl: string;
  discordUsername: string;
  discordUrl: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop", // Default Man
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", // Woman
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop", // Neon Abstract
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop"  // Gamepad/Setup
];

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetSelect = (url: string) => {
    handleChange("profilePhoto", url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f101a] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">
              Profili Düzenle & Özelleştir
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/5 p-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Alert */}
        {showSavedToast && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-xs font-semibold">
            <Check className="h-4 w-4" />
            <span>Ayarlarınız başarıyla kaydedildi! Sayfa güncelleniyor.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-purple-400" />
                Sitenin İsmi / Logo Adı
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                placeholder="Örn. Weew"
                className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                <Image className="h-3.5 w-3.5 text-purple-400" />
                Profil Fotoğrafı URL
              </label>
              <input
                type="text"
                value={formData.profilePhoto}
                onChange={(e) => handleChange("profilePhoto", e.target.value)}
                placeholder="Resim URL yapıştırın"
                className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Preset Avatar Selection */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider block">
              Hazır Profil Fotoğrafı Seçenekleri
            </span>
            <div className="flex gap-4">
              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(url)}
                  className={`relative h-12 w-12 rounded-full overflow-hidden border-2 transition ${
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

          {/* Biography Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Hakkımda / Bio (Türkçe)
              </label>
              <textarea
                value={formData.bioTR}
                onChange={(e) => handleChange("bioTR", e.target.value)}
                rows={3}
                placeholder="Türkçe biyografinizi yazın..."
                className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
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
                placeholder="Write your English biography..."
                className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>
          </div>

          {/* Social Platforms Panel */}
          <div className="border-t border-white/5 pt-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-4">
              Sosyal Medya Linkleri ve Kullanıcı Adları
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kick */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-[#00e676] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e676]" />
                  KICK KANALI
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.kickUsername}
                    onChange={(e) => handleChange("kickUsername", e.target.value)}
                    placeholder="Kullanıcı adı (Örn. /weew)"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.kickUrl}
                    onChange={(e) => handleChange("kickUrl", e.target.value)}
                    placeholder="Kanal linki (Örn. https://kick.com/weew)"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-[#e1306c] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e1306c]" />
                  INSTAGRAM
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.instagramUsername}
                    onChange={(e) => handleChange("instagramUsername", e.target.value)}
                    placeholder="Kullanıcı adı (Örn. @weew)"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.instagramUrl}
                    onChange={(e) => handleChange("instagramUrl", e.target.value)}
                    placeholder="Profil linki"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  YOUTUBE
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.youtubeUsername}
                    onChange={(e) => handleChange("youtubeUsername", e.target.value)}
                    placeholder="Kullanıcı adı"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    placeholder="Kanal linki"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* TikTok */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  TIKTOK
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.tiktokUsername}
                    onChange={(e) => handleChange("tiktokUsername", e.target.value)}
                    placeholder="Kullanıcı adı"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.tiktokUrl}
                    onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                    placeholder="Profil linki"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Discord */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3 sm:col-span-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  DISCORD SUNUCUSU
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.discordUsername}
                    onChange={(e) => handleChange("discordUsername", e.target.value)}
                    placeholder="Yazı (Örn. Sunucuya Katıl)"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.discordUrl}
                    onChange={(e) => handleChange("discordUrl", e.target.value)}
                    placeholder="Davet linki"
                    className="w-full rounded-lg bg-[#0e0f17] border border-white/5 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/5 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 text-xs uppercase tracking-widest transition flex items-center gap-1.5 shadow-[0_4px_15px_rgba(168,85,247,0.3)]"
            >
              <Save className="h-4 w-4" />
              <span>Kaydet</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
