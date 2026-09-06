/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enables a minimal, self-contained build for the optional Docker
  // deployment path described in README.md.
  output: "standalone",
};

export default nextConfig;
