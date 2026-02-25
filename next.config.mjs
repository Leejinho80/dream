/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["yahoo-finance2", "rss-parser"],
  },
  images: {
    domains: ["finance.naver.com", "ssl.pstatic.net"],
  },
};

export default nextConfig;
