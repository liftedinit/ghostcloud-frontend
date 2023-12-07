/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static site in production
  ...(process.env.NEXT_OUTPUT === "export"
    ? { output: process.env.NEXT_OUTPUT }
    : {}),
  reactStrictMode: true,
  swcMinify: true,
  // Disable image optimization on static site production build
  images: {
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZE === "true",
  },
}

module.exports = nextConfig
