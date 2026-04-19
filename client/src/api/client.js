import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export async function getProducts() {
  const { data } = await api.get("/products");
  return data;
}

export async function addProduct(url) {
  const { data } = await api.post("/products", { url });
  return data;
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

export async function toggleProduct(id, active) {
  const { data } = await api.patch(`/products/${id}`, { active });
  return data;
}

export async function runTracking() {
  const { data } = await api.post("/track/run");
  return data;
}

export async function getHistory(id) {
  const { data } = await api.get(`/products/${id}/history`);
  return data;
}

export async function getSchedulerStatus() {
  const { data } = await api.get("/scheduler/status");
  return data;
}
