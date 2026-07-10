import React, { useState, useEffect } from "react";
import { Link, RefreshCw, Save, Activity, Tv } from "lucide-react";
import { triggerWebhook, saveWebhookConfig } from "../utils/webhookHelper";

interface WebhookIntegrationsPanelProps {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function WebhookIntegrationsPanel({ showToast }: WebhookIntegrationsPanelProps) {
  const [discordUrl, setDiscordUrl] = useState(() => localStorage.getItem("weew_discord_webhook_url") || "");
  const [kickUrl, setKickUrl] = useState(() => localStorage.getItem("weew_kick_webhook_url") || "");
  const [enabledStart, setEnabledStart] = useState(() => localStorage.getItem("weew_webhook_event_giveaway_start") !== "false");
  const [enabledWinner, setEnabledWinner] = useState(() => localStorage.getItem("weew_webhook_event_giveaway_winner") !== "false");
  const [enabledLive, setEnabledLive] = useState(() => localStorage.getItem("weew_webhook_event_stream_live") !== "false");
  const [webhookLogs, setWebhookLogs] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("weew_webhook_logs") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [isTesting, setIsTesting] = useState(false);

  // Update logs when custom event fires
  useEffect(() => {
    const updateLogs = () => {
      try {
        setWebhookLogs(JSON.parse(localStorage.getItem("weew_webhook_logs") || "[]"));
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("weew_webhook_logs_update", updateLogs);
    return () => window.removeEventListener("weew_webhook_logs_update", updateLogs);
  }, []);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookConfig({
      discordUrl,
      kickUrl,
      enabledEvents: {
        giveawayStart: enabledStart,
        giveawayWinner: enabledWinner,
        streamLive: enabledLive,
      },
    });
    showToast("Discord ve Kick Webhook entegrasyon ayarları başarıyla kaydedildi!", "success");
  };

  const handleSendTestWebhook = async () => {
    if (!discordUrl) {
      showToast("Lütfen önce geçerli bir Discord Webhook URL girin!", "error");
      return;
    }
    setIsTesting(true);
    showToast("Test webhook sinyali gönderiliyor...", "info");
    try {
      await triggerWebhook("giveaway_start", {
        prize: "🔑 TEST ÖDÜLÜ: Karambit | Doppler (Test)",
        description: "Discord ve Kick Webhook entegrasyonu başarıyla doğrulanmıştır! Saniyeler içinde gerçek zamanlı veri akışı sağlanabilir.",
      });
      showToast("Test sinyali başarıyla gönderildi! Discord kanalınızı kontrol edin.", "success");
    } catch (err) {
      showToast("Webhook gönderim hatası!", "error");
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearLogs = () => {
    localStorage.setItem("weew_webhook_logs", "[]");
    setWebhookLogs([]);
    showToast("Entegrasyon günlükleri temizlendi.", "info");
  };

  return (
    <div className="space-y-6">
      {/* Info Header */}
      <div className="p-5 rounded-2xl bg-[#11121d] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Link className="h-4.5 w-4.5 text-purple-400 shrink-0" />
            Gerçek Zamanlı Webhook Köprüleri
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            Çekiliş odası aktivitelerini, yeni çekiliş başlangıçlarını ve kazanan ilanlarını otomatik olarak Discord sunucunuza veya Kick botunuza bildirim olarak gönderin.
          </p>
        </div>
        <button
          type="button"
          disabled={isTesting || !discordUrl}
          onClick={handleSendTestWebhook}
          className="rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-wider px-4 py-2.5 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg shadow-purple-600/15"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} />
          Discord Test Sinyali Gönder
        </button>
      </div>

      <form onSubmit={handleSaveWebhook} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Webhook Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest block border-b border-white/5 pb-2">
              Webhook Endpoint Bağlantıları
            </span>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Discord Webhook URL
                </label>
                <input
                  type="url"
                  value={discordUrl}
                  onChange={(e) => setDiscordUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition font-mono"
                />
                <p className="text-[9px] text-gray-500 leading-normal">
                  Discord kanal ayarlarından entegrasyonlar sekmesini kullanarak bir webhook oluşturup buraya yapıştırın.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Kick Webhook Simulator / Custom API Endpoint (Gelişmiş)
                </label>
                <input
                  type="url"
                  value={kickUrl}
                  onChange={(e) => setKickUrl(e.target.value)}
                  placeholder="https://api.siteniz.com/kick-webhook"
                  className="w-full rounded-xl bg-[#131522] border border-white/5 px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition font-mono"
                />
                <p className="text-[9px] text-gray-500 leading-normal">
                  Harici bir botu, Kick yayın odasını veya sunucunuzu beslemek için JSON payload gönderilecek özel sunucu adresi.
                </p>
              </div>
            </div>
          </div>

          {/* Event Toggles */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3.5">
            <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest block border-b border-white/5 pb-2">
              Tetiklenecek Sistem Olayları
            </span>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 transition border border-white/5 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Yeni Çekiliş Başlangıcı</span>
                  <span className="text-[9px] text-gray-500">Herhangi bir çekiliş oluşturulduğunda veya yayına alındığında.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enabledStart}
                  onChange={(e) => setEnabledStart(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 transition border border-white/5 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Çekiliş Kazananı Açıklanması</span>
                  <span className="text-[9px] text-gray-500">Çark durup kazanan belirlendiğinde otomatik sonuçları yayınlar.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enabledWinner}
                  onChange={(e) => setEnabledWinner(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 transition border border-white/5 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Canlı Yayın Durumu (Live Indicator)</span>
                  <span className="text-[9px] text-gray-500">Yayını manuel veya otomatik olarak canlı moda geçirdiğinizde.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enabledLive}
                  onChange={(e) => setEnabledLive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 px-6 text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-[0_4px_15px_rgba(168,85,247,0.3)] cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Köprü Ayarlarını Kaydet</span>
            </button>
          </div>
        </div>

        {/* Right Column: Webhook logs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#11121d] border border-white/5 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="h-4 w-4" />
                  Gönderim Günlüğü (Logs)
                </span>
                {webhookLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearLogs}
                    className="text-[9px] font-black uppercase text-red-400 hover:text-red-300 transition"
                  >
                    Günlüğü Temizle
                  </button>
                )}
              </div>

              {webhookLogs.length === 0 ? (
                <div className="py-12 text-center text-gray-600 border border-dashed border-white/5 rounded-xl">
                  <Tv className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-[10px] font-mono uppercase tracking-wider font-bold">Veri Akışı Yok</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">Henüz tetiklenen bir webhook sinyali bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                  {webhookLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition text-xs font-mono space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">{log.timestamp}</span>
                        <span className="text-[#00e676] bg-[#00e676]/5 border border-[#00e676]/20 px-1 py-0.2 rounded text-[8px] font-bold">
                          {log.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase text-[9px] font-bold">ETKİNLİK: </span>
                        <span className="text-purple-400 font-bold">
                          {log.event === "giveaway_start"
                            ? "Çekiliş Başladı"
                            : log.event === "giveaway_winner"
                            ? "Kazanan Çekildi"
                            : "Yayın Canlı"}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        <span className="text-gray-400">Detay: </span>
                        {log.payloadSummary}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
