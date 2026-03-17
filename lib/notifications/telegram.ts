export async function sendTelegramNotification(lead: {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  company?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram bot token or chat ID not set. Skipping notification.");
    return;
  }

  const text = `
🚀 *New Lead Created*

👤 *Name:* ${lead.first_name} ${lead.last_name}
🏢 *Company:* ${lead.company || "N/A"}
📧 *Email:* ${lead.email || "N/A"}
📱 *Phone:* ${lead.phone || "N/A"}

💬 *Message:*
${lead.message || "No message provided."}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API error:", errorData);
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}
