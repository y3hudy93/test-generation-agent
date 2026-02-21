import { ExternalUser } from "@/types/external"
import { DomainUser, SubscriptionType } from "@/types/domain"

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid or missing field: ${field}`)
  }
  return value
}

function parseDate(value: unknown, field: string): Date {
  const str = assertString(value, field)
  const date = new Date(str)

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format for field: ${field}`)
  }

  return date
}

export function normalizeUser(apiUser: ExternalUser): DomainUser {
  if (!apiUser) {
    throw new Error("User object is required")
  }

  const id = assertString(apiUser.user_id, "user_id")
  const name = assertString(apiUser.full_name, "full_name")

  const isActive = apiUser.account_status === "ACTIVE"

  const createdAt = parseDate(apiUser.created_at, "created_at")

  let subscriptionType: SubscriptionType = "free"
  let subscriptionExpiresAt: Date | null = null

  if (apiUser.subscription?.type === "pro") {
    subscriptionType = "pro"

    if (apiUser.subscription.expires) {
      subscriptionExpiresAt = parseDate(
        apiUser.subscription.expires,
        "subscription.expires"
      )
    }
  }

  const canEdit =
    Array.isArray(apiUser.permissions) &&
    apiUser.permissions.includes("WRITE")

  return {
    id,
    name,
    isActive,
    createdAt,
    subscriptionType,
    subscriptionExpiresAt,
    canEdit,
  }
}