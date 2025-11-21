/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // The following is required in order to use `yarn next export`
  // experimental: {
  //   images: {
  //     unoptimized: true,
  //   },
  // },
}

module.exports = nextConfig
