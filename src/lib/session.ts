import type { SessionOptions } from "iron-session";

export const SESSION_COOKIE_NAME = "portfolio_admin_session";

export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be at least 32 characters");
    }
    // Dev/build fallback so `next build` can compile without admin env
    return {
      password: "dev-only-32-char-secret-change-me!!",
      cookieName: SESSION_COOKIE_NAME,
      cookieOptions: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 14,
      },
    };
  }
  return {
    password,
    cookieName: SESSION_COOKIE_NAME,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    },
  };
}

export type AdminSession = {
  isLoggedIn: boolean;
  email?: string;
};
