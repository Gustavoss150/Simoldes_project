/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // URL da API
    NEXT_PUBLIC_TOKEN_KEY: process.env.NEXT_PUBLIC_TOKEN_KEY, // Chave do token no localStorage
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9000/api/:path*', // Redireciona para o backend
      },
    ]
  },
};

module.exports = nextConfig;
