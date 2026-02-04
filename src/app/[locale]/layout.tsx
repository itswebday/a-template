// import type { ReactNode } from "react";
// import * as evolv365 from "itswebday/evolv365";
// import * as zubaidshah from "itswebday/zubaidshah";
// import "itswebday/tenants/styles.css";

// const TENANT_MODULES = {
//   evolv365,
//   zubaidshah,
// } as const;

// const getTenant = () => {
//   const slug = process.env.NEXT_PUBLIC_TENANT_SLUG as keyof typeof TENANT_MODULES;

//   if (!slug || !(slug in TENANT_MODULES)) {
//     throw new Error(
//       "NEXT_PUBLIC_TENANT_SLUG is required and must be a valid tenant (evolv365, zubaidshah).",
//     );
//   }

//   return TENANT_MODULES[slug];
// };

// export const generateMetadata = () => {
//   const tenant = getTenant();

//   return tenant.metadata ?? {};
// };

// type PageLayoutProps = Readonly<{
//   children: ReactNode;
// }>;

// const PageLayout = ({ children }: PageLayoutProps) => {
//   const tenant = getTenant();
//   const HomeLayout = tenant.HomeLayout;

//   return <HomeLayout>{children}</HomeLayout>;
// };

// export default PageLayout;

import { HomeLayout, metadata, StudioHomeLayout } from "itswebday/zubaidshah";
import "itswebday/tenants/styles.css";

export { metadata, StudioHomeLayout };
export default HomeLayout;
