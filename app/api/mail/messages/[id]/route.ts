import { NextResponse } from "next/server"
import { getMessage, deleteMessage, type Provider } from "@/lib/mail-upstream"
import { readAuth } from "@/lib/mail-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { token, provider } = readAuth(request)
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 })
  }

  const result = await getMessage(provider as Provider, token, id)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json(result.data)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { token, provider } = readAuth(request)
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 })
  }

  const result = await deleteMessage(provider as Provider, token, id)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json({ ok: true })
}
