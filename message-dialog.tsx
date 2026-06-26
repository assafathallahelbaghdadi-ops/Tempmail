"use client"

import { useEffect, useState } from "react"
import { Loader2, Paperclip, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/lib/i18n"
import type { MailMessageDetail } from "@/lib/use-mailbox"

type MessageDialogProps = {
  messageId: string | null
  onOpenChange: (open: boolean) => void
  fetchMessage: (id: string) => Promise<MailMessageDetail>
  onDelete: (id: string) => void
}

export function MessageDialog({
  messageId,
  onOpenChange,
  fetchMessage,
  onDelete,
}: MessageDialogProps) {
  const { t, dir } = useI18n()
  const [message, setMessage] = useState<MailMessageDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!messageId) {
      setMessage(null)
      return
    }
    setLoading(true)
    fetchMessage(messageId)
      .then(setMessage)
      .catch(() => setMessage(null))
      .finally(() => setLoading(false))
  }, [messageId, fetchMessage])

  return (
    <Dialog open={!!messageId} onOpenChange={onOpenChange}>
      <DialogContent
        dir={dir}
        className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        {loading || !message ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            <span className="text-sm">{t("message.loading")}</span>
          </div>
        ) : (
          <div className="flex max-h-[90vh] flex-col">
            <DialogHeader className="space-y-3 p-5 text-start">
              <DialogTitle className="pe-6 text-balance text-lg leading-snug">
                {message.subject || t("inbox.noSubject")}
              </DialogTitle>

              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold uppercase text-primary">
                  {(message.from.name || message.from.address).charAt(0)}
                </div>
                <div className="min-w-0 flex-1 text-sm" dir="ltr">
                  <p className="truncate font-semibold text-foreground">
                    {message.from.name || message.from.address}
                  </p>
                  <p className="truncate text-muted-foreground">{message.from.address}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>

              {message.attachments?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {message.attachments.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 text-xs"
                    >
                      <Paperclip className="size-3.5" aria-hidden="true" />
                      {a.filename}
                    </span>
                  ))}
                </div>
              )}
            </DialogHeader>

            <Separator />

            <div className="flex-1 overflow-y-auto p-5">
              {message.html && message.html.length > 0 ? (
                <iframe
                  title={message.subject || "email"}
                  sandbox=""
                  className="min-h-[40vh] w-full rounded-lg border border-border bg-white"
                  srcDoc={message.html.join("")}
                />
              ) : (
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/90">
                  {message.text || message.intro}
                </pre>
              )}
            </div>

            <Separator />

            <div className="flex justify-end p-4">
              <Button
                variant="outline"
                onClick={() => {
                  onDelete(message.id)
                  onOpenChange(false)
                }}
                className="gap-2 text-destructive hover:bg-destructive hover:text-white"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {t("message.delete")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
