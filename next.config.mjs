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
         hostname: "**.cdninstagram.com",
       },
       {
         protocol: "https",
         hostname: "**.fbcdn.net",
       },
     ],
   },
};

export default nextConfig;
