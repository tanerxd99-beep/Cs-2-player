/**
 * Utility helper to manage Discord & Kick Webhook configurations and trigger notifications
 */

export interface WebhookConfig {
  discordUrl: string;
  kickUrl: string;
  enabledEvents: {
    giveawayStart: boolean;
    giveawayWinner: boolean;
    streamLive: boolean;
  };
}

export function getWebhookConfig(): WebhookConfig {
  const defaultConfig: WebhookConfig = {
    discordUrl: localStorage.getItem("weew_discord_webhook_url") || "",
    kickUrl: localStorage.getItem("weew_kick_webhook_url") || "",
    enabledEvents: {
      giveawayStart: localStorage.getItem("weew_webhook_event_giveaway_start") !== "false",
      giveawayWinner: localStorage.getItem("weew_webhook_event_giveaway_winner") !== "false",
      streamLive: localStorage.getItem("weew_webhook_event_stream_live") !== "false",
    },
  };
  return defaultConfig;
}

export function saveWebhookConfig(config: WebhookConfig) {
  localStorage.setItem("weew_discord_webhook_url", config.discordUrl);
  localStorage.setItem("weew_kick_webhook_url", config.kickUrl);
  localStorage.setItem("weew_webhook_event_giveaway_start", String(config.enabledEvents.giveawayStart));
  localStorage.setItem("weew_webhook_event_giveaway_winner", String(config.enabledEvents.giveawayWinner));
  localStorage.setItem("weew_webhook_event_stream_live", String(config.enabledEvents.streamLive));
  window.dispatchEvent(new CustomEvent("weew_webhook_config_update"));
}

/**
 * Sends a notification payload to Discord and/or Kick Webhook URLs based on event type
 */
export async function triggerWebhook(
  event: "giveaway_start" | "giveaway_winner" | "stream_live",
  data: {
    prize?: string;
    description?: string;
    winner?: string;
    entrantsCount?: number;
    streamTitle?: string;
    streamUrl?: string;
  }
) {
  const config = getWebhookConfig();
  const timestamp = new Date().toISOString();

  // Create formatted text and embed payloads for Discord
  let discordPayload: any = null;

  if (event === "giveaway_start" && config.enabledEvents.giveawayStart) {
    discordPayload = {
      username: "CS2 Community Hub",
      avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop",
      content: "🎉 **Yeni Bir CS2 Çekilişi Başladı!** Şansını denemek için hemen katıl!",
      embeds: [
        {
          title: "🎁 ÇEKİLİŞ AKTİF!",
          description: `**Ödül:** ${data.prize}\n\n*${data.description || "Hemen katılın ve şansınızı deneyin!"}*`,
          color: 11030263, // Purple color #a855f7
          fields: [
            {
              name: "Katılım Şekli",
              value: "Sohbet takma adınız ve dilediğiniz avatar ile web sitemizden anında katılın!",
              inline: true
            }
          ],
          footer: {
            text: "CS2 Pro Hub • Canlı Çekiliş Sistemi",
            icon_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&auto=format&fit=crop"
          },
          timestamp
        }
      ]
    };
  } else if (event === "giveaway_winner" && config.enabledEvents.giveawayWinner) {
    discordPayload = {
      username: "CS2 Community Hub",
      avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop",
      content: "🏆 **Çekiliş Sonuçlandı!** Kazanan şanslı belli oldu!",
      embeds: [
        {
          title: "🎉 KAZANAN BELLİ OLDU!",
          description: `🎁 **Ödül:** ${data.prize}\n👤 **Kazanan:** **${data.winner}**\n👥 **Toplam Katılımcı:** ${data.entrantsCount || 0}`,
          color: 58982, // Green color #00e676
          fields: [
            {
              name: "Tebrikler!",
              value: "Kazanan izleyicimiz en kısa sürede yayıncı ile iletişime geçmelidir.",
              inline: false
            }
          ],
          footer: {
            text: "CS2 Pro Hub • Canlı Çekiliş Sistemi",
            icon_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&auto=format&fit=crop"
          },
          timestamp
        }
      ]
    };
  } else if (event === "stream_live" && config.enabledEvents.streamLive) {
    discordPayload = {
      username: "CS2 Community Hub",
      avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop",
      content: "🟢 **Yayındayız! Kaçırma, Canlı Yayın Başladı!**",
      embeds: [
        {
          title: "📺 KICK CANLI YAYINI BAŞLADI!",
          description: `**Başlık:** *${data.streamTitle || "Rekabetçi Maçlar & Topluluk Yayını"}*\n\nHemen yayına gelip sohbete katıl, etkileşime gir ve aktif çekilişleri kaçırma!`,
          url: data.streamUrl || "https://kick.com",
          color: 58982, // Kick green
          fields: [
            {
              name: "Yayın Platformu",
              value: "[KICK.com](https://kick.com)",
              inline: true
            }
          ],
          footer: {
            text: "CS2 Pro Hub • Canlı Yayın Sistemi",
            icon_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&auto=format&fit=crop"
          },
          timestamp
        }
      ]
    };
  }

  // Send to Discord
  if (config.discordUrl && discordPayload) {
    try {
      await fetch(config.discordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordPayload),
      });
      console.log(`[Webhook] Sent ${event} successfully to Discord.`);
    } catch (err) {
      console.error("[Webhook] Error sending to Discord webhook:", err);
    }
  }

  // Send to Kick Webhook / Custom endpoint (if defined)
  if (config.kickUrl && discordPayload) {
    try {
      await fetch(config.kickUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          timestamp,
          text: `[${event.toUpperCase()}] ${data.prize ? `Prize: ${data.prize}. ` : ""}${data.winner ? `Winner: ${data.winner}. ` : ""}`,
          data
        }),
      });
      console.log(`[Webhook] Sent ${event} successfully to Kick simulated endpoint.`);
    } catch (err) {
      console.error("[Webhook] Error sending to Kick webhook:", err);
    }
  }

  // Dispatch a local log event so we can show Webhook action logs inside the Admin Dashboard!
  // This is extremely satisfying for users to see that things are actually firing!
  const logs = JSON.parse(localStorage.getItem("weew_webhook_logs") || "[]");
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    event,
    target: config.discordUrl ? "Discord" : "Sistem Günlüğü",
    status: config.discordUrl ? "Gönderildi" : "Simüle Edildi (URL Yok)",
    timestamp: new Date().toLocaleTimeString("tr-TR"),
    payloadSummary: data.prize ? `${data.prize} çekilişi` : data.streamTitle || "Yayın aktivitesi",
  };
  localStorage.setItem("weew_webhook_logs", JSON.stringify([newLog, ...logs].slice(0, 30)));
  window.dispatchEvent(new CustomEvent("weew_webhook_logs_update"));
}
