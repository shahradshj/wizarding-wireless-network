/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://wizardingwireless.network:8080/:path*',
            },
        ];
    }
};

export default nextConfig;
