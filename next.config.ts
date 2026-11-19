import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The AI assistant's daily reindex job reads the blog Markdown and the résumé PDF from
  // public/, which isn't bundled into serverless functions by default.
  outputFileTracingIncludes: {
    "/api/assistant/reindex": ["./public/blog/**/*.md", "./public/resumes/*.pdf"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
