/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: [process.env.NEXT_PUBLIC_BASE_URL.split('//')[1].split(':')[0]],
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
