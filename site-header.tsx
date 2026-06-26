"use client"

import { Mail } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n"

export function SiteHeader() {
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5" aria-label="TempMail home">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">
              Temp<span className="text-primary">Mail</span>
            </span>
            <span className="text-[11px] text-muted-foreground">{t("brand.tagline")}</span>
          </span>
        </a>

        <nav className="flex items-center gap-2">
          <a
            href="#how-it-works"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            {t("nav.howItWorks")}
          </a>
          <a
            href="#faq"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            {t("nav.faq")}
          </a>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
