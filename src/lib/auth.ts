import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { AdminSession } from "@/lib/session";
import { getSessionOptions } from "@/lib/session";

/** Bcrypt hashes always start with $2a$, $2b$, or $2y$ — see https://github.com/kelektiv/node.bcrypt.js#hash-info */
const BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

/**
 * Plain-text bcrypt hash from ADMIN_PASSWORD_HASH. Many .env parsers corrupt unquoted `$`.
 * Prefer ADMIN_PASSWORD_HASH_B64 (base64 of the full hash string) — no `$` in the file.
 */
function normalizePasswordHashFromEnv(raw: string | undefined): string | null {
  if (raw == null) return null;
  let h = raw.trim();
  // Strip one layer of wrapping quotes (sometimes copied from docs)
  if (
    (h.startsWith('"') && h.endsWith('"')) ||
    (h.startsWith("'") && h.endsWith("'"))
  ) {
    h = h.slice(1, -1).trim();
  }
  return h.length > 0 ? h : null;
}

/** Prefer base64 so .env never contains raw `$` (Next / dotenv-expand safe). */
function resolveAdminPasswordHash(): string | null {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8").trim();
      if (BCRYPT_PREFIX.test(decoded)) return decoded;
      console.error(
        "[auth] ADMIN_PASSWORD_HASH_B64 decoded to a string that is not a valid bcrypt hash. Regenerate with: node scripts/bcrypt-hash-to-base64.mjs '<hash>'",
      );
      return null;
    } catch {
      console.error("[auth] ADMIN_PASSWORD_HASH_B64 is not valid base64.");
      return null;
    }
  }

  let h = normalizePasswordHashFromEnv(process.env.ADMIN_PASSWORD_HASH);
  if (!h) return null;

  // Rare: leading `$` stripped by parser but rest intact
  if (!h.startsWith("$") && /^2[aby]\$\d{2}\$/.test(h)) {
    h = `$${h}`;
  }

  return h;
}

export async function getAdminSession() {
  const session = await getIronSession<AdminSession>(cookies(), getSessionOptions());
  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function loginAdmin(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const hash = resolveAdminPasswordHash();
  if (!expectedEmail || !hash) {
    console.error(
      "ADMIN_EMAIL or password hash not configured. Set ADMIN_PASSWORD_HASH_B64 (recommended) or ADMIN_PASSWORD_HASH.",
    );
    return false;
  }
  if (!BCRYPT_PREFIX.test(hash)) {
    console.error(
      "[auth] Password hash does not look like bcrypt. Use ADMIN_PASSWORD_HASH_B64 to avoid .env `$` issues — " +
        "run: node scripts/bcrypt-hash-to-base64.mjs '<paste hash from bcrypt.hash>' and put output in ADMIN_PASSWORD_HASH_B64=",
    );
    return false;
  }
  if (email.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) {
    return false;
  }
  const ok = await bcrypt.compare(password, hash);
  if (!ok) return false;
  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.email = email;
  await session.save();
  return true;
}

export async function logoutAdmin() {
  const session = await getAdminSession();
  session.destroy();
}
