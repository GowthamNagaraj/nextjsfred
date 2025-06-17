/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "out",
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true, // Ignore ESLint warnings during build
    },
    env:{
        NEXT_BASE_API_URL : "http://localhost:1998/GMND/api"
    }
};

export default nextConfig;
