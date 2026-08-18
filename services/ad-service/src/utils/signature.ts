import crypto from "crypto";

export function signImpression(adId: bigint, impressionId: string) {
  return crypto
    .createHmac("sha256", process.env.HMAC_SECRET!)
    .update(`${adId}:${impressionId}`)
    .digest("hex");
}