import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL + "/api" || "http://localhost:4000/api",
  withCredentials: true, // 👈 enables cookies to be sent & received
});

export default api;
