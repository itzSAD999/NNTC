import os from "node:os";
import path from "node:path";

/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "mcnlgcpzqoptolchcyzi.supabase.co";

/** Outside OneDrive — avoids sync corruption and slow cache (de)serialization. */
const webpackCacheDir = path.join(os.tmpdir(), "nmtc-next-webpack");

const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@supabase/ssr",
      "@supabase/supabase-js",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https",
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

};

export default nextConfig;
