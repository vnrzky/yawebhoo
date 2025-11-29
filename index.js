import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

    await channel.send({
      embeds: [{
        title: "🔔 U7BUY Notification",
        description: `Type: **${payload.type}**\nOrder ID: **${payload.orderId}**\nStatus: **${payload.status}**`,
        color: 0x00AE86,
        timestamp: new Date()
      }]
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error handling webhook:", err.message);
    res.status(500).send("Error");
  }
});

// --- Start Express Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Webhook server running on port ${PORT}`);
});

client.login(DISCORD_TOKEN);