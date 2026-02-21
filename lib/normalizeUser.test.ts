import { describe, it, expect } from "vitest"
import { normalizeUser } from "./normalizeUser"

describe("normalizeUser", () => {
  it("should correctly normalize a valid pro active user", () => {
    const apiUser = {
      user_id: "123",
      full_name: "John Doe",
      account_status: "ACTIVE",
      created_at: "2025-01-10T12:30:00Z",
      subscription: {
        type: "pro",
        expires: "2025-12-31T00:00:00Z",
      },
      permissions: ["READ", "WRITE"],
    }

    const result = normalizeUser(apiUser)

    expect(result.id).toBe("123")
    expect(result.name).toBe("John Doe")
    expect(result.isActive).toBe(true)
    expect(result.subscriptionType).toBe("pro")
    expect(result.subscriptionExpiresAt).not.toBeNull()
    expect(result.canEdit).toBe(true)
  })
})