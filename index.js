import express from "express";
import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// --- Discord Bot Startup ---
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// --- Webhook Endpoint ---
app.post("/webhook", async (req, res) => {
  try {
    const payload = req.body; // U7BUY sends JSON here
    console.log("📩 Received webhook:", payload);

    const channel = await client.channels.fetch(CHANNEL_ID);

    // Build embed properly
    const embed = new EmbedBuilder()
      .setTitle("🔔 U7BUY Notification")
      .setDescription(
        `Type: **${payload.type || "N/A"}**\n` +
        `Order ID: **${payload.orderId || "N/A"}**\n` +
        `Status: **${payload.status || "N/A"}**`
      )
      .setColor(0x00AE86)
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    res.status(500).send("Error");
  }
});

// --- Start Express Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Webhook server running on port ${PORT}`);
});

client.login(DISCORD_TOKEN);