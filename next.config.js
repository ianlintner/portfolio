/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ianlintner/theme"],
  // Static export for Azure Static Web Apps / GitHub Pages.
  output: "export",
  images: {
    // Static export requires unoptimized images.
    unoptimized: true,
    domains: ["storage.googleapis.com"],
  },
};

module.exports = nextConfig;
