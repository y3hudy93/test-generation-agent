export type ExternalSubscription = {
  type?: string | null
  expires?: string | null
}

export type ExternalUser = {
  user_id?: string | null
  full_name?: string | null
  account_status?: string | null
  created_at?: string | null
  subscription?: ExternalSubscription | null
  permissions?: string[] | null
}