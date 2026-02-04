"use server";

import { createWebStudioActionInvoker } from "itswebday/webstudio/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const invokeWebStudioAction = createWebStudioActionInvoker(
  createSupabaseServerClient,
  null,
);
