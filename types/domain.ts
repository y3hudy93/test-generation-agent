export type SubscriptionType = "free" | "pro"

export type DomainUser = {
  id: string
  name: string
  isActive: boolean
  createdAt: Date
  subscriptionType: SubscriptionType
  subscriptionExpiresAt: Date | null
  canEdit: boolean
}