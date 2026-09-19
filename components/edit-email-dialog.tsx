"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { Provider } from "@/lib/use-mailbox"

type EditEmailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider?: Provider
  onSubmit: (username: string, domain: string) => Promise<void>
}

export function EditEmailDialog({
  open,
  onOpenChange,
  provider,
  onSubmit,
}: EditEmailDialogProps) {
  const { t, dir } = useI18n()
  const [domains, setDomains] = useState<string[]>([])
  const [username, setUsername] = useState("")
  const [domain, setDomain] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    const url = provider ? `/api/mail/domains?provider=${provider}` : "/api/mail/domains"
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.domains) && data.domains.length > 0) {
          setDomains(data.domains)
          setDomain((d) => d || data.domains[0])
        }
      })
      .catch(() => {})
  }, [open, provider])

  const handleSubmit = async () => {
    if (!username.trim() || !domain) return
    setSubmitting(true)
    try {
      await onSubmit(username.trim().toLowerCase(), domain)
      onOpenChange(false)
      setUsername("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={dir}>
        <DialogHeader className={dir === "rtl" ? "text-right sm:text-right" : undefined}>
          <DialogTitle>{t("edit.title")}</DialogTitle>
          <DialogDescription>{t("edit.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label htmlFor="tm-username" className="text-sm font-medium">
              {t("edit.username")}
            </label>
            <Input
              id="tm-username"
              value={username}
              dir="ltr"
              onChange={(e) =>
                setUsername(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ""))
              }
              placeholder={t("edit.usernamePlaceholder")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-medium">{t("edit.domain")}</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" className="w-full justify-between font-normal" dir="ltr" />}
              >
                <span>@{domain || "..."}</span>
                <ChevronDown className="size-4 opacity-60" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--anchor-width)">
                {domains.map((d) => (
                  <DropdownMenuItem key={d} onClick={() => setDomain(d)} dir="ltr">
                    @{d}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {username && domain && (
            <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm" dir="ltr">
              <span className="font-semibold text-primary">{username}</span>
              <span className="text-muted-foreground">@{domain}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("edit.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!username.trim() || !domain || submitting} className="gap-2">
            {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {submitting ? t("edit.creating") : t("edit.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
