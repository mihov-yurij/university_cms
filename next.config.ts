import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// This instance is the admin plus one public page (the /submit profile form);
// there is no other frontend route tree. The root path rewrites to the admin
// so a bare domain lands somewhere useful.
//
// Media URLs point at the R2 bucket's public origin, so the image optimizer
// needs that host allow-listed. Derived from the same variable the CMS builds
// URLs from. Read at build time: changing R2_PUBLIC_URL needs a rebuild.
const r2PublicUrl = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2PublicUrl
      ? [
          {
            protocol: r2PublicUrl.protocol.replace(":", "") as "http" | "https",
            hostname: r2PublicUrl.hostname,
            pathname: "/**",
          },
        ]
      : [],
  },
  async rewrites() {
    return [
      { source: "/", destination: "/admin" },
      // /admin and /api are dynamic routes of their own; without the
      // exclusion below the rule would rewrite them into each other.
      {
        source: "/:path((?!admin(?:/|$)|api(?:/|$)|submit(?:/|$)|_next/).*)",
        destination: "/admin/:path",
      },
    ];
  },
};

export default withPayload(nextConfig);
