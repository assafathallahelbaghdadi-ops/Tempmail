"use client"

import { Download, MailOpen, ShieldCheck, Wand2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function HowItWorks() {
  const { t } = useI18n()
  const steps = [
    { icon: Wand2, title: t("how.step1.title"), text: t("how.step1.text") },
    { icon: Download, title: t("how.step2.title"), text: t("how.step2.text") },
    { icon: MailOpen, title: t("how.step3.title"), text: t("how.step3.text") },
    { icon: ShieldCheck, title: t("how.step4.title"), text: t("how.step4.text") },
  ]

  return (
    <section id="how-it-works" className="scroll-mt-20">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-balance">
        {t("how.title")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className="relative rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <s.icon className="size-5" aria-hidden="true" />
            </div>
            <span className="absolute end-4 top-4 text-3xl font-bold text-muted/60">
              {i + 1}
            </span>
            <h3 className="mb-1.5 font-semibold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Faq() {
  const { t } = useI18n()
  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ]

  return (
    <section id="faq" className="scroll-mt-20">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-balance">
        {t("faq.title")}
      </h2>
      <div className="mx-auto grid max-w-3xl gap-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border bg-card px-5 py-4 shadow-sm [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
              {item.q}
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-lg leading-none text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
