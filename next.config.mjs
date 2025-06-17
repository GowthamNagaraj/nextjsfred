/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    NEXT_PUBLIC_BASE_API_URL: "https://your-api.vercel.app/api" // or your backend URL
  }
};

export default nextConfig;
