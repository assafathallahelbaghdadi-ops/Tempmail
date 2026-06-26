/**
 * Server-side client for the mail.gw temporary email platform.
 *
 * mail.gw does not use a static API key. Instead, an account is created
 * (address + password) and a JWT token is issued via /token. That token
 * authenticates all subsequent requests. This module handles that flow.
 *
 * mail.gw and mail.tm are sister services that expose an identical API.
 * If the primary provider (mail.gw) is unavailable, we transparently fall
 * back to mail.tm so the site keeps working. The chosen provider is pinned
 * per account because a token issued by one provider is not valid on the other.
 */

export type Provider = "gw" | "tm"

const BASE_URLS: Record<Provider, string> = {
  gw: "https://api.mail.gw",
  tm: "https://api.mail.tm",
}

export const PROVIDER_ORDER: Provider[] = ["gw", "tm"]

type UpstreamResult<T> = { ok: true; data: T; provider: Provider } | {
  ok: false
  status: number
  error: string
}

async function call<T>(
  provider: Provider,
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<UpstreamResult<T>> {
  const { token, headers, ...rest } = init
  try {
    const res = await fetch(`${BASE_URLS[provider]}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: "no-store",
    })

    const text = await res.text()
    const data = text ? JSON.parse(text) : null

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: (data && (data.message || data["hydra:description"])) || res.statusText,
      }
    }
    return { ok: true, data: data as T, provider }
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err instanceof Error ? err.message : "Upstream request failed",
    }
  }
}

/** Try the given provider first, then fall back to the other one. */
async function callWithFallback<T>(
  preferred: Provider | undefined,
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<UpstreamResult<T>> {
  const order = preferred
    ? [preferred, ...PROVIDER_ORDER.filter((p) => p !== preferred)]
    : PROVIDER_ORDER
  let last: UpstreamResult<T> | null = null
  for (const provider of order) {
    const result = await call<T>(provider, path, init)
    // Only fall back on infrastructure failures (5xx / network), not on
    // legitimate client errors like 401/404/422.
    if (result.ok || (result.status < 500 && result.status !== 0)) {
      return result
    }
    last = result
  }
  return last as UpstreamResult<T>
}

export type Domain = {
  id: string
  domain: string
  isActive: boolean
}

export type ApiMessage = {
  id: string
  from: { address: string; name: string }
  to: { address: string; name: string }[]
  subject: string
  intro: string
  seen: boolean
  hasAttachments: boolean
  createdAt: string
}

export type ApiMessageDetail = ApiMessage & {
  text: string
  html: string[]
  attachments: { id: string; filename: string; size: number }[]
}

function members<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === "object" && "hydra:member" in data) {
    return (data as { "hydra:member": T[] })["hydra:member"]
  }
  return []
}

export async function getDomains(provider?: Provider) {
  const res = await callWithFallback<unknown>(provider, "/domains?page=1")
  if (!res.ok) return res
  return {
    ok: true as const,
    provider: res.provider,
    data: members<Domain>(res.data).filter((d) => d.isActive),
  }
}

function randomString(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let out = ""
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length]
  return out
}

export type Session = {
  provider: Provider
  address: string
  password: string
  accountId: string
  token: string
}

/**
 * Create an account (random or custom local part) and obtain a JWT token.
 * Returns everything the client needs to authenticate future requests.
 */
export async function createSession(opts: {
  provider?: Provider
  username?: string
  domain?: string
  password?: string
}): Promise<UpstreamResult<Session>> {
  // 1. Resolve a domain (and provider) to use.
  const domainsRes = await getDomains(opts.provider)
  if (!domainsRes.ok) return domainsRes
  const provider = domainsRes.provider
  const domains = domainsRes.data
  if (domains.length === 0) {
    return { ok: false, status: 503, error: "No active domains available" }
  }
  const domain =
    (opts.domain && domains.find((d) => d.domain === opts.domain)?.domain) ||
    domains[0].domain

  const username = (opts.username?.trim() || randomString(12)).toLowerCase()
  const address = `${username}@${domain}`
  const password = opts.password || randomString(16)

  // 2. Create the account.
  const accountRes = await call<{ id: string }>(provider, "/accounts", {
    method: "POST",
    body: JSON.stringify({ address, password }),
  })
  if (!accountRes.ok) return accountRes

  // 3. Obtain a token.
  const tokenRes = await call<{ token: string; id: string }>(provider, "/token", {
    method: "POST",
    body: JSON.stringify({ address, password }),
  })
  if (!tokenRes.ok) return tokenRes

  return {
    ok: true,
    provider,
    data: {
      provider,
      address,
      password,
      accountId: accountRes.data.id,
      token: tokenRes.data.token,
    },
  }
}

export async function listMessages(provider: Provider, token: string) {
  const res = await call<unknown>(provider, "/messages?page=1", { token })
  if (!res.ok) return res
  return {
    ok: true as const,
    provider,
    data: members<ApiMessage>(res.data),
  }
}

export async function getMessage(provider: Provider, token: string, id: string) {
  return call<ApiMessageDetail>(provider, `/messages/${id}`, { token })
}

export async function deleteMessage(provider: Provider, token: string, id: string) {
  return call<unknown>(provider, `/messages/${id}`, { method: "DELETE", token })
}

export async function deleteAccount(provider: Provider, token: string, id: string) {
  return call<unknown>(provider, `/accounts/${id}`, { method: "DELETE", token })
}
