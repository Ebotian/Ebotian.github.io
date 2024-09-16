   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone',
     experimental: {
       appDir: true,
     },
     typescript: {
       ignoreBuildErrors: true,
     },
     eslint: {
       ignoreDuringBuilds: true,
     },
     reactStrictMode: true,
     swcMinify: true,
   };

   export default nextConfig;