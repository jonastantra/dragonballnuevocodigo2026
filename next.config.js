/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isCustomDomain = process.env.CUSTOM_DOMAIN === "true";
const repoName = "dragonballnuevocodigo2026";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  assetPrefix: isGitHubPages && !isCustomDomain ? `/${repoName}/` : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
