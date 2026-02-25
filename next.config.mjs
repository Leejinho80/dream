/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["yahoo-finance2"],
  },
  images: {
    domains: ["finance.naver.com", "ssl.pstatic.net"],
  },
};

export default nextConfig;
