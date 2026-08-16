import type { NextConfig } from "next";

// GitHub Pages serves this project from https://<user>.github.io/typing-app/,
// so all routes/assets need to be prefixed with the repo name in production.
// Locally (`next dev`) and outside CI this stays empty so nothing changes there.
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = "typing-app";
const basePath = isGithubActions ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // next/image's default loader needs a running server; this app doesn't
    // currently use next/image, but this keeps a static export safe if it does.
    unoptimized: true,
  },
};

export default nextConfig;
