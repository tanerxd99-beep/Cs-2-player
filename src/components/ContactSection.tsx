import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2, User, Mail, MessageSquare, AlertCircle } from "lucide-react";
import { TranslationDict } from "../types";

interface ContactSectionProps {
  translations: TranslationDict;
  lang: "TR" | "EN";
}

export default function ContactSection({ translations, lang }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Lütfen isminizi giriniz.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }
    if (!message.trim() || message.length < 10) {
      setErrorMsg("Lütfen en az 10 karakter içeren bir mesaj yazın.");
      return;
    }

    setIsSubmitting(true);

    // Save message locally for Admin Panel Inbox
    try {
      const newMessage = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        date: new Date().toLocaleString("tr-TR")
      };
      const raw = localStorage.getItem("weew_messages");
      let messagesList = [];
      if (raw) {
        messagesList = JSON.parse(raw);
      }
      messagesList.unshift(newMessage);
      localStorage.setItem("weew_messages", JSON.stringify(messagesList));
    } catch (err) {
      console.error("Failed to save message", err);
    }

    // Simulate database write or API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1800);
  };

  return (
    <section id="contact" className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute inset-0 purple-glow opacity-10 pointer-events-none -z-10" />

      {/* Title */}
      <div className="mb-8 text-center" id="contact-header-container">
        <span className="font-mono text-xs text-purple-400 font-semibold tracking-widest block mb-1">
          // {translations.contactTitle}
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">
          {translations.contactSub}
        </h2>
      </div>

      {/* Main card box container */}
      <div className="rounded-3xl border border-white/5 bg-[#10111a] p-6 sm:p-8 shadow-2xl relative overflow-hidden" id="contact-form-box">
        
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            
            /* Form state */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
              id="contact-form-element"
            >
              
              {/* Error Alert Bar */}
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-xs font-semibold">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name and Email side-by-side row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <User className="h-3.5 w-3.5 text-purple-400" />
                    <span>{translations.contactName}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. İrem Saltanat"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition disabled:opacity-50"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Mail className="h-3.5 w-3.5 text-purple-400" />
                    <span>{translations.contactEmail}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition disabled:opacity-50"
                  />
                </div>

              </div>

              {/* Message */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
                  <span>{translations.contactMessage}</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajınızı buraya yazınız..."
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full rounded-xl bg-[#151724] border border-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition disabled:opacity-50 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="contact-form-submit-btn"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 text-sm uppercase tracking-widest transition duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(168,85,247,0.3)] cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isSubmitting ? "MESAJ GÖNDERİLİYOR..." : translations.contactSubmit}</span>
              </button>

            </motion.form>
          ) : (
            
            /* Success confirmation feedback state */
            <motion.div
              key="success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="text-center py-10 flex flex-col items-center"
              id="contact-success-view"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {lang === "TR" ? "Mesaj Alındı!" : "Message Received!"}
              </h3>
              
              <p className="text-gray-400 font-medium text-sm max-w-sm mb-6">
                {translations.contactSuccess}
              </p>

              <button
                onClick={() => setIsSuccess(false)}
                id="contact-success-reset-btn"
                className="rounded-xl border border-white/5 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
              >
                {lang === "TR" ? "YENİ MESAJ GÖNDER" : "SEND NEW MESSAGE"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
