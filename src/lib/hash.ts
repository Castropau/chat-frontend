// // Encode a number as URL-safe Base64
// export function hashId(id: number) {
//   const base64 = Buffer.from(id.toString(), "utf-8").toString("base64");
//   return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
// }

// // Decode a URL-safe Base64 back to number
// export function unhashId(hash: string) {
//   try {
//     // Add padding
//     const pad = hash.length % 4;
//     const padded = hash + (pad ? "=".repeat(4 - pad) : "");
//     const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
//     return parseInt(Buffer.from(base64, "base64").toString("utf-8"));
//   } catch (err) {
//     return null;
//   }
// }
// Constants for obfuscation
const MULTIPLIER = 982_451_653; // large prime
const OFFSET = 1_234_567_891;   // arbitrary constant

// Encode a number as a long URL-safe hash
export function hashId(id: number) {
  const obfuscated = id * MULTIPLIER + OFFSET;
  const base64 = Buffer.from(obfuscated.toString(), "utf-8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Decode a URL-safe hash back to number
export function unhashId(hash: string) {
  try {
    const pad = hash.length % 4;
    const padded = hash + (pad ? "=".repeat(4 - pad) : "");
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    const obfuscated = parseInt(Buffer.from(base64, "base64").toString("utf-8"));
    const id = Math.floor((obfuscated - OFFSET) / MULTIPLIER);
    return id;
  } catch (err) {
      console.error("Failed to unhash ID:", err);

    return null;
  }
}
