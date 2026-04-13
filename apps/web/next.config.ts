import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ihotel/ui",
    "@ihotel/api",
    "@ihotel/config",
    "@ihotel/hooks",
    "@ihotel/types",
    "react-native",
    "react-native-web",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
