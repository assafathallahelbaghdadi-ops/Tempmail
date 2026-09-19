"use client"

import { useEffect } from "react"
import { Megaphone } from "lucide-react"
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/adsense"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdSlotProps = {
  slot: string
  className?: string
  /** Approximate height used for the placeholder + layout stability. */
  minHeight?: number
  format?: string
}

export function AdSlot({
  slot,
  className,
  minHeight = 100,
  format = "auto",
}: AdSlotProps) {
  const { t } = useI18n()

  useEffect(() => {
    if (!ADSENSE_ENABLED) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not ready yet
    }
  }, [])

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/40",
        className,
      )}
      aria-label={t("ad.label")}
      style={{ minHeight }}
    >
      {ADSENSE_ENABLED ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground"
          style={{ minHeight }}
        >
          <Megaphone className="size-5" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wider">
            {t("ad.label")}
          </span>
        </div>
      )}
    </div>
  )
}
