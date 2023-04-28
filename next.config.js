/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.NODE_ENV === "production" ? "/" : "",
  publicRuntimeConfig: {
    contextPath: process.env.NODE_ENV === "production" ? "/" : "",
    uploadPath:
      process.env.NODE_ENV === "production"
        ? "/"
        : "/api/upload",
  }
};

module.exports = nextConfig;
