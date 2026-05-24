import { getTeamSession } from './auth.js'

const API_BASE = 'https://api.glasslm.space'
const QUEUE_KEY = 'glasslm_event_queue'
const RATE_LIMIT_MS = 2000

let lastReportTime = 0

export interface EventPayload {
  provider: string
  maskedTypes: string[]
  itemsMasked: number
  riskScore: number
  policyAction: 'none' | 'warned' | 'blocked' | 'redacted'
}

export async function reportEvent(payload: EventPayload): Promise<void> {
  const session = await getTeamSession()
  if (!session) return

  const now = Date.now()
  if (now - lastReportTime < RATE_LIMIT_MS) {
    await queueEvent(payload)
    return
  }
  lastReportTime = now

  const success = await sendEvent(session, payload)
  if (!success) await queueEvent(payload)
}

async function sendEvent(
  session: { token: string; orgId: string; email: string },
  payload: EventPayload
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_id: session.orgId,
        user_email: session.email,
        extension_token: session.token,
        provider: payload.provider,
        source: 'extension',
        masked_types: payload.maskedTypes,
        items_masked: payload.itemsMasked,
        risk_score: payload.riskScore,
        tokens_processed: 0,
        policy_action: payload.policyAction,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function queueEvent(payload: EventPayload): Promise<void> {
  const result = await chrome.storage.local.get(QUEUE_KEY)
  const queue: EventPayload[] = result[QUEUE_KEY] ?? []
  queue.push(payload)
  // Keep queue at max 50 events to avoid storage bloat
  const trimmed = queue.slice(-50)
  await chrome.storage.local.set({ [QUEUE_KEY]: trimmed })
}

export async function flushQueue(): Promise<void> {
  const session = await getTeamSession()
  if (!session) return

  const result = await chrome.storage.local.get(QUEUE_KEY)
  const queue: EventPayload[] = result[QUEUE_KEY] ?? []
  if (queue.length === 0) return

  const sent: number[] = []
  for (let i = 0; i < queue.length; i++) {
    const ok = await sendEvent(session, queue[i])
    if (ok) sent.push(i)
  }

  const remaining = queue.filter((_, i) => !sent.includes(i))
  await chrome.storage.local.set({ [QUEUE_KEY]: remaining })
}
