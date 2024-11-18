/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'export',
    async redirects() {
        return [
            {
                source: '//reset-password',
                destination: '/reset-password',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
