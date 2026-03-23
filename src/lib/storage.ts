import { S3mini } from "s3mini";

function getR2Endpoint(): string {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!accountId || !bucket) {
    throw new Error("Missing R2_ACCOUNT_ID or R2_BUCKET_NAME");
  }
  return `https://${accountId}.r2.cloudflarestorage.com/${bucket}`;
}

function getClient(): S3mini {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Missing R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY");
  }
  return new S3mini({
    accessKeyId,
    secretAccessKey,
    endpoint: getR2Endpoint(),
    region: "auto",
  });
}

/** Public R2 base URL for resolving storage keys (server; pass into admin RichEditor). */
export function getPublicAssetBaseUrl(): string {
  return process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
}

/** If value is already an http(s) URL, return as-is; otherwise prefix with public R2 base. */
export function resolvePublicUrl(keyOrUrl: string): string {
  if (!keyOrUrl) return "";
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
    return keyOrUrl;
  }
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  if (!base) return keyOrUrl;
  const key = keyOrUrl.replace(/^\//, "");
  return `${base}/${key}`;
}

/**
 * Returns a browser-usable URL for a stored object key or passthrough URL.
 */
export function getFileUrl(key: string): string {
  return resolvePublicUrl(key);
}

/**
 * Upload raw bytes to R2. Returns the **key** (not full URL) for storing in the database.
 */
export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getClient();
  const normalizedKey = key.replace(/^\//, "");
  const res = await client.putObject(normalizedKey, file, contentType || "application/octet-stream");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`R2 upload failed: ${res.status} ${text}`);
  }
  return normalizedKey;
}

export async function deleteFile(key: string): Promise<void> {
  if (!key || key.startsWith("http://") || key.startsWith("https://")) {
    return;
  }
  const client = getClient();
  await client.deleteObject(key.replace(/^\//, ""));
}
