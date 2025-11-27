import { DEFAULT_LOCALE, PREVIEW_URL } from "@/constants";
import { PayloadRequest } from "payload";

type Props = {
  req: PayloadRequest;
  global?: string;
};

export const getPreviewPath = async ({ req }: Props) => {
  const locale = req?.locale || DEFAULT_LOCALE;
  const path = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  return `${PREVIEW_URL}?${encodedParams.toString()}`;
};
