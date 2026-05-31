import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
}

export default nextConfig
