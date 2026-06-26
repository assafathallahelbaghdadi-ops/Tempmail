"use client"

import { useState } from "react"
import { Check, Copy, Loader2, Mail, Pencil, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type EmailBarProps = {
  address: string | null
  busy: boolean
  onCopy: () => void
  onRefresh: () => void
  onEdit: () => void
  onDelete: () => void
}

export function EmailBar({
  address,
  busy,
  onCopy,
  onRefresh,
  onEdit,
  onDelete,
}: EmailBarProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!address) return
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t("address.label")}
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Address display */}
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {address ? (
            <button
              type="button"
              onClick={handleCopy}
              className="min-w-0 flex-1 truncate text-start text-base font-semibold tracking-tight text-foreground sm:text-lg"
              title={address}
            >
              {address}
            </button>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("address.loading")}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
          <Button
            onClick={handleCopy}
            disabled={!address}
            className="gap-2"
            aria-label={t("action.copy")}
          >
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            <span>{copied ? t("action.copied") : t("action.copy")}</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onRefresh}
            disabled={!address || busy}
            className="gap-2"
            aria-label={t("action.refresh")}
          >
            <RefreshCw
              className={cn("size-4", busy && "animate-spin")}
              aria-hidden="true"
            />
            <span>{t("action.refresh")}</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onEdit}
            disabled={busy}
            className="gap-2"
            aria-label={t("action.change")}
          >
            <Pencil className="size-4" aria-hidden="true" />
            <span>{t("action.change")}</span>
          </Button>

          <Button
            variant="outline"
            onClick={onDelete}
            disabled={busy}
            className="gap-2 text-destructive hover:bg-destructive hover:text-white"
            aria-label={t("action.delete")}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span>{t("action.delete")}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
