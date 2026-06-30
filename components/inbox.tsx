"use client"

import { Inbox as InboxIcon, Loader2, Paperclip, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useI18n } from "@/lib/i18n"
import type { MailMessage } from "@/lib/use-mailbox"
import { cn } from "@/lib/utils"

function useTimeAgo() {
  const { t, lang } = useI18n()
  return (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return t("inbox.justNow")
    if (mins < 60) return `${mins} ${t("inbox.minutesAgo")}`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}${lang === "en" ? "" : " "}${t("inbox.hoursAgo")}`
    const days = Math.floor(hours / 24)
    return `${days}${lang === "en" ? "" : " "}${t("inbox.daysAgo")}`
  }
}

function avatarColor(seed: string) {
  const colors = [
    "bg-chart-1/15 text-chart-1",
    "bg-chart-2/15 text-chart-2",
    "bg-chart-3/15 text-chart-3",
    "bg-chart-4/15 text-chart-4",
    "bg-chart-5/15 text-chart-5",
  ]
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return colors[h % colors.length]
}

type InboxProps = {
  messages: MailMessage[]
  loading: boolean
  validating: boolean
  hasSession: boolean
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}

export function Inbox({
  messages,
  loading,
  validating,
  hasSession,
  onOpen,
  onDelete,
}: InboxProps) {
  const { t } = useI18n()
  const timeAgo = useTimeAgo()
  const count = messages.length

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">{t("inbox.title")}</h2>
          {count > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {validating && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {t("inbox.autoRefresh")}
        </span>
      </header>

      {loading || (!hasSession && count === 0) ? (
        <ul className="divide-y divide-border">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-4 sm:px-5">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </li>
          ))}
        </ul>
      ) : count === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-muted">
            <InboxIcon className="size-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold">{t("inbox.empty.title")}</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {t("inbox.empty.subtitle")}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "group flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 sm:px-5",
                !m.seen && "bg-accent/30",
              )}
              onClick={() => onOpen(m.id)}
            >
              <div
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold uppercase",
                  avatarColor(m.from.address),
                )}
              >
                {(m.from.name || m.from.address).charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {m.from.name || m.from.address}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(m.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {!m.seen && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                  <span className="truncate text-sm font-medium text-foreground/90">
                    {m.subject || t("inbox.noSubject")}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{m.intro}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {m.hasAttachments && (
                  <Paperclip className="size-4 text-muted-foreground" aria-hidden="true" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(m.id)
                  }}
                  aria-label={t("message.delete")}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
