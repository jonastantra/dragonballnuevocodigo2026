import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/buscar/",
        "/wp-json/",
        "/xmlrpc.php",
        "/*/feed/",
        "/wp-content/",
        "/wp-includes/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
