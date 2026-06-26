"use client"

import { Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function SiteFooter() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-tight">
              Temp<span className="text-primary">Mail</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground/80">
            {t("footer.disclaimer")}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {year} TempMail. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
