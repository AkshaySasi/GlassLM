import { getTeamSession } from './auth.js'

const API_BASE = 'https://api.glasslm.space'
const CACHE_KEY = 'glasslm_policies'
const CACHE_TTL_MS = 5 * 60 * 1000

export interface OrgPolicy {
  data_type: string
  action: 'warn' | 'block' | 'redact'
  enabled: boolean
}

export interface PolicyCheckResult {
  action: 'allow' | 'warn' | 'block' | 'redact'
  triggeredTypes: string[]
  message: string
}

async function getCachedPolicies(orgId: string): Promise<OrgPolicy[] | null> {
  const result = await chrome.storage.local.get(CACHE_KEY)
  const cached = result[CACHE_KEY] as { orgId: string; policies: OrgPolicy[]; fetchedAt: number } | undefined
  if (!cached || cached.orgId !== orgId) return null
  if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null
  return cached.policies
}

async function fetchPolicies(orgId: string, token: string): Promise<OrgPolicy[]> {
  try {
    const res = await fetch(`${API_BASE}/api/policies?org_id=${orgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return []
    const data = await res.json() as { policies: OrgPolicy[] }
    await chrome.storage.local.set({
      [CACHE_KEY]: { orgId, policies: data.policies, fetchedAt: Date.now() },
    })
    return data.policies
  } catch {
    return []
  }
}

export async function getPolicies(): Promise<OrgPolicy[]> {
  const session = await getTeamSession()
  if (!session) return []

  const cached = await getCachedPolicies(session.orgId)
  if (cached) return cached

  return fetchPolicies(session.orgId, session.token)
}

export async function refreshPolicies(): Promise<void> {
  const session = await getTeamSession()
  if (!session) return
  await fetchPolicies(session.orgId, session.token)
}

export async function checkPolicy(maskedTypes: string[]): Promise<PolicyCheckResult> {
  if (maskedTypes.length === 0) {
    return { action: 'allow', triggeredTypes: [], message: '' }
  }

  const policies = await getPolicies()
  const upperTypes = maskedTypes.map((t) => t.toUpperCase())

  const triggered = policies.filter(
    (p) => p.enabled && upperTypes.includes(p.data_type)
  )

  if (triggered.length === 0) {
    return { action: 'allow', triggeredTypes: [], message: '' }
  }

  const actions = triggered.map((p) => p.action)
  const action = actions.includes('block')
    ? 'block'
    : actions.includes('redact')
    ? 'redact'
    : 'warn'

  const triggeredTypes = triggered.map((p) => p.data_type)

  const messages: Record<string, string> = {
    warn: `⚠️ GlassLM: This message contains ${triggeredTypes.join(', ')}. Your organization policy flagged this. You can still proceed.`,
    block: `🚫 GlassLM: Message blocked. Your organization policy prevents sending ${triggeredTypes.join(', ')} to AI providers.`,
    redact: `🔒 GlassLM: Sensitive data (${triggeredTypes.join(', ')}) was automatically redacted before sending.`,
  }

  return { action, triggeredTypes, message: messages[action] }
}
