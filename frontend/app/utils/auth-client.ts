// app/utils/auth-client.ts
import { redirect } from "react-router";

const API_URL = import.meta.env.VITE_BACKEND_URL

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) throw redirect("/login");

  // 1st try
  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If expired → refresh and retry
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshRes.status !== 200) {
      sessionStorage.removeItem("access_token");
      throw redirect("/login");
    }

    const { access_token } = await refreshRes.json();
    sessionStorage.setItem("access_token", access_token);

    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${access_token}`,
      },
    });
  }

  if (!res.ok) {
    sessionStorage.removeItem("access_token");
    throw redirect("/login");
  }

  return res.json();
}

export { fetchWithAuth };
