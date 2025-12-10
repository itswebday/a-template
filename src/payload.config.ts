import {
  BlogPosts,
  FormSubmissions,
  Forms,
  Media,
  Pages,
  Users,
} from "@/collections";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import {
  Blog,
  CookiePolicy,
  Footer,
  Home,
  Navigation,
  PrivacyPolicy,
  TermsAndConditions,
} from "@/globals";
import { plugins } from "@/plugins";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [Media, Users, Pages, BlogPosts, Forms, FormSubmissions],
  globals: [
    Navigation,
    Footer,
    Home,
    Blog,
    PrivacyPolicy,
    CookiePolicy,
    TermsAndConditions,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
    },
  }),
  plugins: [...plugins],
  localization: {
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  sharp: sharp,
});
