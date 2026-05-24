const BASE = import.meta.env.VITE_API_URL as string ?? 'https://api.glasslm.space'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error: string }).error ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

// Dashboard
export const getDashboardSummary = (orgId: string, days = 7) =>
  request<DashboardSummary>(`/api/dashboard/summary?org_id=${orgId}&days=${days}`)

export const getDashboardUsers = (orgId: string, days = 7) =>
  request<{ users: UserRisk[] }>(`/api/dashboard/users?org_id=${orgId}&days=${days}`)

// Policies
export const getPolicies = (orgId: string) =>
  request<{ policies: Policy[] }>(`/api/policies?org_id=${orgId}`)

export const upsertPolicy = (body: {
  org_id: string; data_type: string; action: string; enabled: boolean
}) => request<{ ok: boolean }>('/api/policies', { method: 'PUT', body: JSON.stringify(body) })

// Team
export const getTeam = (orgId: string) =>
  request<{ members: Member[] }>(`/api/team?org_id=${orgId}`)

export const inviteMember = (body: {
  org_id: string; email: string; role: string; invited_by_name: string; org_name: string
}) => request<{ ok: boolean }>('/api/team/invite', { method: 'POST', body: JSON.stringify(body) })

export const removeMember = (id: string) =>
  request<{ ok: boolean }>(`/api/team/${id}`, { method: 'DELETE' })

// API Keys
export const getApiKeys = (orgId: string) =>
  request<{ keys: ApiKey[] }>(`/api/keys?org_id=${orgId}`)

export const createApiKey = (orgId: string, label: string) =>
  request<{ key: string; prefix: string; label: string }>('/api/keys', {
    method: 'POST',
    body: JSON.stringify({ org_id: orgId, label }),
  })

export const revokeApiKey = (id: string) =>
  request<{ ok: boolean }>(`/api/keys/${id}`, { method: 'DELETE' })

// Types
export interface DashboardSummary {
  total_events: number
  events_with_pii: number
  blocked: number
  avg_risk: number
  type_counts: Record<string, number>
  provider_counts: Record<string, number>
  timeline: Record<string, number>
  days: number
}

export interface UserRisk {
  user_hash: string
  event_count: number
  avg_risk: number
  top_type: string
  providers: string[]
  blocked_count: number
}

export interface Policy {
  id: string
  org_id: string
  data_type: string
  action: 'warn' | 'block' | 'redact'
  enabled: boolean
}

export interface Member {
  id: string
  email: string
  role: 'admin' | 'member'
  joined_at: string | null
  created_at: string
}

export interface ApiKey {
  id: string
  label: string
  key_prefix: string
  last_used_at: string | null
  created_at: string
  revoked_at: string | null
}
