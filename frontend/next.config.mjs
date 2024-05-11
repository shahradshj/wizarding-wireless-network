/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: process.env.BACKEND_PROTOCOL,
                hostname: process.env.BACKEND_HOST,
                port: process.env.BACKEND_PORT,
                pathname: '/posters/**',

            },
        ],
    },
};

export default nextConfig;
