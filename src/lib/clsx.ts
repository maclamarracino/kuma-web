export type ClassValue = string | number | boolean | undefined | null | Record<string, boolean | undefined | null>

export function clsx(...inputs: ClassValue[]): string {
  let result = ""

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === "string" || typeof input === "number") {
      result += " " + input
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) {
          result += " " + key
        }
      }
    }
  }

  return result.trim()
}
