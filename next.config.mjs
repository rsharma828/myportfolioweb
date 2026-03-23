const r2Patterns = [];
try {
  if (process.env.R2_PUBLIC_URL) {
    const u = new URL(process.env.R2_PUBLIC_URL);
    r2Patterns.push({
      protocol: u.protocol.replace(":", ""),
      hostname: u.hostname,
      pathname: "/**",
    });
  }
} catch {
  /* ignore */
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", pathname: "/**" },
      {
        protocol: "https",
        hostname: "tavus-videos-store.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
      ...r2Patterns,
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
