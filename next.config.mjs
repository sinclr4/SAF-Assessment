import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    // ESLint runs separately in CI; skip during next build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
