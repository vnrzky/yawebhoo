import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const U7BUY_BASE_URL = "https://openapi.u7buy.com/prod-api";
const APP_ID = process.env.U7BUY_APP_ID;
const APP_SECRET = process.env.U7BUY_APP_SECRET;

async function getToken() {
  try {
    const res = await axios.post(`${U7BUY_BASE_URL}/auth/token`, {
      appId: APP_ID,
      appSecret: APP_SECRET
    }, {
      headers: { "Content-Type": "application/json" }
    });
    return res.data.access_token;
  } catch (err) {
    console.error("❌ Failed to get token:", err.response?.data || err.message);
    throw err;
  }
}

async function listOrders(token) {
  try {
    const res = await axios.get(`${U7BUY_BASE_URL}/open-api/order/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to list orders:", err.response?.data || err.message);
    throw err;
  }
}

async function getOrderDetail(token, orderId) {
  try {
    const res = await axios.get(`${U7BUY_BASE_URL}/open-api/order`, {
      params: { orderId },
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to get order detail:", err.response?.data || err.message);
    throw err;
  }
}

async function startDelivery(token, orderId, params) {
  try {
    const res = await axios.post(`${U7BUY_BASE_URL}/open-api/order/start_deliery`, {
      orderId,
      ...params
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to start delivery:", err.response?.data || err.message);
    throw err;
  }
}

async function completeDelivery(token, orderId) {
  try {
    const res = await axios.post(`${U7BUY_BASE_URL}/open-api/order/complete_deliery`, {
      orderId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to complete delivery:", err.response?.data || err.message);
    throw err;
  }
}

// --- Test Runner ---
async function main() {
  try {
    const token = await getToken();
    console.log("✅ Got token:", token);

    const orders = await listOrders(token);
    console.log("📦 Orders:", orders);

    // Example: get detail of first order if exists
    if (orders?.data?.length > 0) {
      const orderId = orders.data[0].orderId;
      const detail = await getOrderDetail(token, orderId);
      console.log("🔍 Order detail:", detail);
    }
  } catch (err) {
    console.error("❌ Test run failed:", err.message);
  }
}

main();