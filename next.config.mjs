/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "stoneza.in",
      },
      {
        protocol: "https",
        hostname: "*.stoneza.in",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/product",
        permanent: true,
      },
      {
        source: "/products/:slug*",
        destination: "/product/:slug*",
        permanent: true,
      },
      {
        source: "/categories",
        destination: "/product",
        permanent: true,
      },
      {
        source: "/categories/:slug*",
        destination: "/product-category/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
