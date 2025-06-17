/** @type {import('next').NextConfig} */
const nextConfig = {
    // output:"export",
    distDir: "out",
    eslint: {
        ignoreDuringBuilds: true, // Ignore ESLint warnings during build
    },
    env:{
        NEXT_BASE_API_URL : "http://localhost:1998/GMND/api"
    }
};

export default nextConfig;
