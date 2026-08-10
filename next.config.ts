import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 60, 70, 75, 80, 100],
  },
    experimental: {
    inlineCss: true,
  },

  output: "standalone",
  turbopack: {},
};

export default withNextIntl(nextConfig);
