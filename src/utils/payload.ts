import { getPayload, type Payload } from "payload";
import configPromise from "@/payload.config";

// Cache a single Payload client per process to avoid repeated schema pulls
const globalForPayload = globalThis as unknown as {
  _payloadClient?: Promise<Payload>;
};

export const getCachedPayload = async () => {
  if (!globalForPayload._payloadClient) {
    globalForPayload._payloadClient = getPayload({ config: configPromise });
  }

  return globalForPayload._payloadClient;
};
