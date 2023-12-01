/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // The following is required in order to use `yarn next export`
  // experimental: {
  //   images: {
  //     unoptimized: true,
  //   },
  // },
}

module.exports = nextConfig
