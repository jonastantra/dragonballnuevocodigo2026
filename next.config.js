/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "dragonballnuevocodigo2026";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  assetPrefix: isGitHubPages ? `/${repoName}/` : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
