import { redirect } from "react-router";

export async function clientAction() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  try {
    // Tell backend to clear refresh_token cookie
    await fetch(`${backendUrl}/auth/logout`, {
      method: "POST",
      credentials: "include", // sends cookies
    });
  } catch (err) {
    console.error("Logout error:", err);
  }

  // Remove access token
  sessionStorage.removeItem("access_token");

  // Redirect to login page
  throw redirect("/login");
}