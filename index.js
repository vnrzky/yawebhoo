import axios from "axios";

const U7BUY_BASE_URL = "https://openapi.u7buy.com/prod-api";
const APP_ID = process.env.U7BUY_APP_ID;
const APP_SECRET = process.env.U7BUY_APP_SECRET;

async function getToken() {
  const res = await axios.post(`${U7BUY_BASE_URL}/auth/token`, {
    appId: APP_ID,
    appSecret: APP_SECRET
  }, {
    headers: { "Content-Type": "application/json" }
  });
  return res.data.access_token;
}

async function listOrders(token) {
  const res = await axios.get(`${U7BUY_BASE_URL}/open-api/order/list`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

async function getOrderDetail(token, orderId) {
  const res = await axios.get(`${U7BUY_BASE_URL}/open-api/order`, {
    params: { orderId },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

async function startDelivery(token, orderId, params) {
  const res = await axios.post(`${U7BUY_BASE_URL}/open-api/order/start_deliery`, {
    orderId,
    ...params
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

async function completeDelivery(token, orderId) {
  const res = await axios.post(`${U7BUY_BASE_URL}/open-api/order/complete_deliery`, {
    orderId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}