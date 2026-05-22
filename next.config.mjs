/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/login", destination: "/", permanent: false },
      { source: "/registration", destination: "/contact", permanent: false },
      { source: "/signup", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
