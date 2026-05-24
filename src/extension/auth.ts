const STORAGE_KEY = 'glasslm_team_token'
const ORG_KEY = 'glasslm_org_id'
const EMAIL_KEY = 'glasslm_user_email'

export interface TeamSession {
  token: string
  orgId: string
  email: string
}

export async function getTeamSession(): Promise<TeamSession | null> {
  const result = await chrome.storage.local.get([STORAGE_KEY, ORG_KEY, EMAIL_KEY])
  const token = result[STORAGE_KEY] as string | undefined
  const orgId = result[ORG_KEY] as string | undefined
  const email = result[EMAIL_KEY] as string | undefined

  if (!token || !orgId || !email) return null
  return { token, orgId, email }
}

export async function saveTeamSession(session: TeamSession): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEY]: session.token,
    [ORG_KEY]: session.orgId,
    [EMAIL_KEY]: session.email,
  })
}

export async function clearTeamSession(): Promise<void> {
  await chrome.storage.local.remove([STORAGE_KEY, ORG_KEY, EMAIL_KEY])
}

export async function isConnected(): Promise<boolean> {
  const session = await getTeamSession()
  return session !== null
}
