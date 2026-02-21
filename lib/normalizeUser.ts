import { ExternalUser } from "@/types/external"
import { DomainUser, SubscriptionType } from "@/types/domain"

/**
 * Validates if a value is a non-empty string.
 * 
 * @param value - The value to check.
 * @param field - The name of the field (for error messages).
 * @returns The proven string.
 * @throws Error if the value is not a string or is empty.
 */
function assertString(value: unknown, field: string): string {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Invalid or missing field: ${field}`)
    }
    return value
}

/**
 * Parses a date string into a Date object.
 * 
 * @param value - The value to parse.
 * @param field - The name of the field (for error messages).
 * @returns A valid Date object.
 * @throws Error if the date is invalid.
 */
function parseDate(value: unknown, field: string): Date {
    const str = assertString(value, field)
    const date = new Date(str)

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format for field: ${field}`)
    }

    return date
}

/**
 * Normalizes an external API user object into a domain-specific user object.
 * 
 * @param apiUser - The raw user data from the external API (can be null or undefined).
 * @returns A normalized DomainUser object.
 * @throws Error if the apiUser is missing or contains invalid critical data.
 */
export function normalizeUser(apiUser: ExternalUser | null | undefined): DomainUser {
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