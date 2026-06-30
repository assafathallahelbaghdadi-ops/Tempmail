"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EmailBar } from "@/components/email-bar"
import { Inbox } from "@/components/inbox"
import { EditEmailDialog } from "@/components/edit-email-dialog"
import { MessageDialog } from "@/components/message-dialog"
import { HowItWorks, Faq } from "@/components/info-sections"
import { AdSlot } from "@/components/ad-slot"
import { useI18n } from "@/lib/i18n"
import { useMailbox } from "@/lib/use-mailbox"
import { AD_SLOTS } from "@/lib/adsense"

export function TempMailApp() {
  const { t } = useI18n()
  const mailbox = useMailbox()
  const [editOpen, setEditOpen] = useState(false)
  const [openMessageId, setOpenMessageId] = useState<string | null>(null)

  // Notify on new incoming mail.
  useEffect(() => {
    if (mailbox.newArrival) {
      toast.success(t("toast.newMessage"), {
        description: `${t("inbox.from")}: ${
          mailbox.newArrival.from.name || mailbox.newArrival.from.address
        }`,
      })
      mailbox.clearNewArrival()
    }
  }, [mailbox, t])

  const handleCopy = () => {
    if (!mailbox.session) return
    navigator.clipboard.writeText(mailbox.session.address).then(() => {
      toast.success(t("toast.copied"))
    })
  }

  const handleRefresh = () => {
    mailbox.refresh()
  }

  const handleDeleteAddress = async () => {
    try {
      await mailbox.deleteAddress()
      toast.success(t("toast.deleted"))
    } catch {
      toast.error(t("toast.error"))
    }
  }

  const handleChange = async (username: string, domain: string) => {
    try {
      await mailbox.changeAddress(username, domain)
      toast.success(t("toast.created"))
    } catch {
      toast.error(t("toast.error"))
    }
  }

  const handleDeleteMessage = async (id: string) => {
    try {
      await mailbox.deleteMessage(id)
      toast.success(t("toast.messageDeleted"))
    } catch {
      toast.error(t("toast.error"))
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        {/* Hero */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {t("hero.title")}
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Email address + actions */}
        <EmailBar
          address={mailbox.session?.address ?? null}
          busy={mailbox.creating}
          onCopy={handleCopy}
          onRefresh={handleRefresh}
          onEdit={() => setEditOpen(true)}
          onDelete={handleDeleteAddress}
        />

        {/* Top ad */}
        <div className="my-6">
          <AdSlot slot={AD_SLOTS.top} minHeight={90} />
        </div>

        {/* Inbox */}
        <Inbox
          messages={mailbox.messages}
          loading={mailbox.isLoading}
          validating={mailbox.isValidating}
          hasSession={!!mailbox.session}
          onOpen={setOpenMessageId}
          onDelete={handleDeleteMessage}
        />

        {/* Inline ad */}
        <div className="my-10">
          <AdSlot slot={AD_SLOTS.inline} minHeight={120} />
        </div>

        {/* Info */}
        <div className="space-y-14">
          <HowItWorks />
          <Faq />
        </div>

        {/* Bottom ad */}
        <div className="mt-10">
          <AdSlot slot={AD_SLOTS.bottom} minHeight={90} />
        </div>
      </main>

      <SiteFooter />

      <EditEmailDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        provider={mailbox.session?.provider}
        onSubmit={handleChange}
      />

      <MessageDialog
        messageId={openMessageId}
        onOpenChange={(open) => !open && setOpenMessageId(null)}
        fetchMessage={mailbox.fetchMessage}
        onDelete={handleDeleteMessage}
      />
    </div>
  )
}
