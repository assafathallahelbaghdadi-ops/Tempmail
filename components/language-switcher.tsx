"use client"

import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LANGS, useI18n } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()
  const current = LANGS.find((l) => l.code === lang)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="gap-2" aria-label={t("nav.language")} />}
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="font-medium">{current?.native}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded bg-muted text-xs font-semibold">
                {l.flag}
              </span>
              {l.native}
            </span>
            {lang === l.code && <Check className="size-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
