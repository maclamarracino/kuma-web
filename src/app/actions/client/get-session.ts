// src/app/actions/get-session.ts
"use server"

import { getSessionFromCookie } from "@/src/lib/auth-api"

export async function getSessionSafe() {
  return await getSessionFromCookie()
}
