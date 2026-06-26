import type { Provider } from "@/lib/mail-upstream"

/** Extract the JWT token and pinned provider from an incoming request. */
export function readAuth(request: Request): {
  token: string | null
  provider: Provider
} {
  const auth = request.headers.get("authorization") || ""
  const token = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : null
  const providerHeader = request.headers.get("x-mail-provider")
  const provider: Provider = providerHeader === "tm" ? "tm" : "gw"
  return { token, provider }
}
