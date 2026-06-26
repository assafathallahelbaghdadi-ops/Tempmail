"use client"

import useSWR from "swr"
import { useCallback, useEffect, useRef, useState } from "react"

export type Provider = "gw" | "tm"

export type Session = {
  provider: Provider
  address: string
  password: string
  accountId: string
  token: string
}

export type MailMessage = {
  id: string
  from: { address: string; name: string }
  to: { address: string; name: string }[]
  subject: string
  intro: string
  seen: boolean
  hasAttachments: boolean
  createdAt: string
}

export type MailMessageDetail = MailMessage & {
  text: string
  html: string[]
  attachments: { id: string; filename: string; size: number }[]
}

const SESSION_KEY = "tempmail-session"

function loadSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function saveSession(session: Session | null) {
  if (typeof window === "undefined") return
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(SESSION_KEY)
  }
}

function authHeaders(session: Session): HeadersInit {
  return {
    Authorization: `Bearer ${session.token}`,
    "x-mail-provider": session.provider,
  }
}

async function createAccount(opts?: {
  username?: string
  domain?: string
  provider?: Provider
}): Promise<Session> {
  const res = await fetch("/api/mail/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts ?? {}),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "Failed to create address")
  }
  return res.json()
}

export function useMailbox() {
  const [session, setSession] = useState<Session | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [creating, setCreating] = useState(false)
  const prevIdsRef = useRef<Set<string>>(new Set())

  // Restore session on mount, or create a fresh one.
  useEffect(() => {
    const existing = loadSession()
    if (existing) {
      setSession(existing)
      setHydrated(true)
    } else {
      setCreating(true)
      createAccount()
        .then((s) => {
          saveSession(s)
          setSession(s)
        })
        .catch(() => {})
        .finally(() => {
          setCreating(false)
          setHydrated(true)
        })
    }
  }, [])

  const fetcher = useCallback(
    async (_key: string): Promise<MailMessage[]> => {
      if (!session) return []
      const res = await fetch("/api/mail/messages", {
        headers: authHeaders(session),
      })
      if (res.status === 401) {
        // Token expired — start over with a fresh address.
        saveSession(null)
        setSession(null)
        return []
      }
      if (!res.ok) throw new Error("Failed to load messages")
      const data = await res.json()
      return data.messages as MailMessage[]
    },
    [session],
  )

  const {
    data: messages,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<MailMessage[]>(
    session ? ["messages", session.address] : null,
    fetcher,
    {
      refreshInterval: 8000,
      revalidateOnFocus: true,
      dedupingInterval: 3000,
    },
  )

  // Track new arrivals so the UI can notify the user.
  const [newArrival, setNewArrival] = useState<MailMessage | null>(null)
  useEffect(() => {
    if (!messages) return
    const currentIds = new Set(messages.map((m) => m.id))
    if (prevIdsRef.current.size > 0) {
      const fresh = messages.find((m) => !prevIdsRef.current.has(m.id))
      if (fresh) setNewArrival(fresh)
    }
    prevIdsRef.current = currentIds
  }, [messages])

  const regenerate = useCallback(async () => {
    setCreating(true)
    try {
      const s = await createAccount()
      saveSession(s)
      prevIdsRef.current = new Set()
      setSession(s)
      await mutate([], { revalidate: false })
      return s
    } finally {
      setCreating(false)
    }
  }, [mutate])

  const changeAddress = useCallback(
    async (username: string, domain: string) => {
      setCreating(true)
      try {
        const s = await createAccount({
          username,
          domain,
          provider: session?.provider,
        })
        saveSession(s)
        prevIdsRef.current = new Set()
        setSession(s)
        await mutate([], { revalidate: false })
        return s
      } finally {
        setCreating(false)
      }
    },
    [mutate, session?.provider],
  )

  const deleteAddress = useCallback(async () => {
    if (session) {
      await fetch(`/api/mail/accounts/${session.accountId}`, {
        method: "DELETE",
        headers: authHeaders(session),
      }).catch(() => {})
    }
    return regenerate()
  }, [session, regenerate])

  const deleteMessage = useCallback(
    async (id: string) => {
      if (!session) return
      await fetch(`/api/mail/messages/${id}`, {
        method: "DELETE",
        headers: authHeaders(session),
      })
      await mutate(
        (curr) => (curr ? curr.filter((m) => m.id !== id) : curr),
        { revalidate: false },
      )
    },
    [session, mutate],
  )

  const fetchMessage = useCallback(
    async (id: string): Promise<MailMessageDetail> => {
      if (!session) throw new Error("No session")
      const res = await fetch(`/api/mail/messages/${id}`, {
        headers: authHeaders(session),
      })
      if (!res.ok) throw new Error("Failed to load message")
      return res.json()
    },
    [session],
  )

  return {
    session,
    hydrated,
    creating,
    messages: messages ?? [],
    isLoading: isLoading || (!session && creating),
    isValidating,
    newArrival,
    clearNewArrival: () => setNewArrival(null),
    refresh: () => mutate(),
    regenerate,
    changeAddress,
    deleteAddress,
    deleteMessage,
    fetchMessage,
  }
}
