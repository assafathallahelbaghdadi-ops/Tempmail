/**
 * Google AdSense configuration.
 *
 * 1. Replace the publisher ID below with your own (looks like "ca-pub-XXXXXXXXXXXXXXXX").
 *    You can also set it via the NEXT_PUBLIC_ADSENSE_CLIENT environment variable.
 * 2. Create ad units in your AdSense dashboard and put their slot IDs in AD_SLOTS.
 * 3. Once your site is approved, real ads will automatically replace the placeholders.
 */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-0000000000000000"

export const AD_SLOTS = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "0000000001",
  inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE || "0000000002",
  bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || "0000000003",
}

/** Ads only go live once a real publisher ID has been configured. */
export const ADSENSE_ENABLED = ADSENSE_CLIENT !== "ca-pub-0000000000000000"
