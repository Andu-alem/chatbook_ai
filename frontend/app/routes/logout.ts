import { redirect } from "react-router";

export async function clientAction() {
  try {
    // Tell backend to clear refresh_token cookie
    await fetch("http://127.0.0.1:8000/auth/logout", {
      method: "POST",
      credentials: "include", // sends cookies
    });
  } catch (err) {
    console.error("Logout error:", err);
  }

  // Remove access token
  localStorage.removeItem("access_token");

  // Redirect to login page
  throw redirect("/login");
}