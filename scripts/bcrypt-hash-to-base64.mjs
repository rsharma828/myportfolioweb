#!/usr/bin/env node
/**
 * Usage (pass the full bcrypt hash as one argument; quote it so $ is not expanded by the shell):
 *   node scripts/bcrypt-hash-to-base64.mjs '$2b$12$..............................................................'
 *
 * Then set in .env:
 *   ADMIN_PASSWORD_HASH_B64=<paste output>
 */
const hash = process.argv[2];
if (!hash || hash.startsWith("-")) {
  console.error("Usage: node scripts/bcrypt-hash-to-base64.mjs '<full bcrypt hash from bcrypt.hash()>'");
  process.exit(1);
}
process.stdout.write(Buffer.from(hash, "utf8").toString("base64") + "\n");
