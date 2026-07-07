import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Mail, Lock, User, CheckCircle2, Shield, AlertCircle, ArrowRight } from "lucide-react";

export interface UserAccount {
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  isRegistrationDisabled?: boolean;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  isRegistrationDisabled = false 
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (activeTab === "register" && isRegistrationDisabled) {
      setErrorMsg("Yeni üye kaydı kurucu tarafından geçici olarak kapatılmıştır.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }
    if (password.length < 5) {
      setErrorMsg("Şifre en az 5 karakter uzunluğunda olmalıdır.");
      return;
    }

    // Load registered users from localStorage
    const usersRaw = localStorage.getItem("weew_registered_users");
    let users: Record<string, { name: string; password: string; role: "admin" | "user"; createdAt: string }> = {};
    if (usersRaw) {
      try {
        users = JSON.parse(usersRaw);
      } catch (e) {
        // ignore
      }
    }

    // Auto-seed iremsaltanat002001@gmail.com if not exists as Super Admin
    const superAdminEmail = "iremsaltanat002001@gmail.com";
    if (!users[superAdminEmail]) {
      users[superAdminEmail] = {
        name: "İrem Saltanat",
        password: "admin", // Default password, can login with any password too or "admin"
        role: "admin",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("weew_registered_users", JSON.stringify(users));
    }

    if (activeTab === "register") {
      if (!name.trim()) {
        setErrorMsg("Lütfen isminizi giriniz.");
        return;
      }
      
      const emailLower = email.trim().toLowerCase();
      if (users[emailLower]) {
        setErrorMsg("Bu e-posta adresiyle zaten kayıtlı bir kullanıcı var.");
        return;
      }

      // Create new user account
      // If it's the special email, force admin. Otherwise default to user
      const isSuperAdmin = emailLower === superAdminEmail;
      const newUser = {
        name: name.trim(),
        password: password,
        role: (isSuperAdmin ? "admin" : "user") as "admin" | "user",
        createdAt: new Date().toISOString()
      };

      users[emailLower] = newUser;
      localStorage.setItem("weew_registered_users", JSON.stringify(users));

      setSuccessMsg("Kayıt işleminiz başarıyla tamamlandı! Giriş yapılıyor.");
      setTimeout(() => {
        onLoginSuccess({
          email: emailLower,
          name: newUser.name,
          role: newUser.role,
          createdAt: newUser.createdAt
        });
        onClose();
      }, 1500);

    } else {
      // Login flow
      const emailLower = email.trim().toLowerCase();
      const user = users[emailLower];

      // Special override: iremsaltanat002001@gmail.com gets absolute admin instantly
      if (emailLower === superAdminEmail) {
        setSuccessMsg("Hoş geldin, Kurucu Super Admin!");
        setTimeout(() => {
          onLoginSuccess({
            email: emailLower,
            name: "İrem Saltanat",
            role: "admin",
            createdAt: new Date().toISOString()
          });
          onClose();
        }, 1200);
        return;
      }

      if (!user) {
        setErrorMsg("Bu e-posta adresine ait bir kullanıcı bulunamadı.");
        return;
      }

      if (user.password !== password) {
        setErrorMsg("Şifre hatalı. Lütfen tekrar deneyiniz.");
        return;
      }

      setSuccessMsg(`Başarıyla giriş yapıldı. Hoş geldin, ${user.name}!`);
      setTimeout(() => {
        onLoginSuccess({
          email: emailLower,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        });
        onClose();
      }, 1200);
    }
  };

  // Helper to prefill iremsaltanat002001@gmail.com for ease of testing
  const prefillSuperAdmin = () => {
    setEmail("iremsaltanat002001@gmail.com");
    setPassword("admin");
    setActiveTab("login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Auth Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f101a] p-6 sm:p-8 shadow-2xl z-10 text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl border border-white/5 p-2 text-gray-400 hover:text-white hover:bg-white/5 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand / Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Shield className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-widest">
            Weew Portal
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wider">
            Yayıncı & Topluluk Portalı Girişi
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/5">
          <button
            onClick={() => {
              setActiveTab("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "login"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "register"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Alerts messages */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-xs font-semibold">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        {activeTab === "register" && isRegistrationDisabled ? (
          <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Lock className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-red-400 uppercase tracking-wider">KAYITLAR KAPATILMIŞTIR</h4>
              <p className="text-[11px] text-gray-400 leading-normal uppercase font-semibold">
                Sistem kurucusu yeni üye kayıtlarını geçici olarak durdurmuştur. Sadece kayıtlı kullanıcılar giriş yapabilir.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white transition flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>GİRİŞ YAP SAYFASINA DÖN</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleAction} className="space-y-4">
            {activeTab === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-purple-400" />
                  İsim Soyisim
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn. İrem Saltanat"
                  required
                  className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-purple-400" />
                E-Posta Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="isim@domain.com"
                required
                className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-purple-400" />
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••"
                required
                className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Action button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-3 text-xs font-black uppercase tracking-widest text-white transition shadow-[0_4px_15px_rgba(168,85,247,0.3)] mt-6 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{activeTab === "login" ? "GİRİŞ YAP" : "KAYIT İŞLEMİNİ TAMAMLA"}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
