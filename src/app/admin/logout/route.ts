import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  cookies().delete("session_id")
  return NextResponse.redirect(new URL("/admin-login", request.url), { status: 302 })
}
