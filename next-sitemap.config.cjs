const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ["/sitemap.xml", "/api/*", "/admin/*", "/*/api/*", "/*/admin/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/api/*", "/admin/*", "/*/api/*", "/*/admin/*"],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/sitemap.xml`],
  },
};
