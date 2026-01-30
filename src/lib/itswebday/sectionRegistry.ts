import type { SectionRegistry } from "itswebday";

export const getSectionRegistry = async (
  slug: string,
): Promise<SectionRegistry> => {
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG;

  if (slug !== tenantSlug) {
    throw new Error(
      `This app serves tenant "${tenantSlug}" only. Requested: ${slug}`,
    );
  }

  const sections = await import(`itswebday/sections/${tenantSlug}`);

  return sections.sectionRegistry as SectionRegistry;
};
