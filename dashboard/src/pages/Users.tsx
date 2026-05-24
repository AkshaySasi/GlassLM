import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPlus, Trash2, Crown, AlertTriangle } from 'lucide-react'
import { getTeam, getDashboardUsers, inviteMember, removeMember } from '../lib/api'
import { toast } from 'sonner'

const ORG_ID = localStorage.getItem('glasslm_org_id') ?? ''

const RISK_COLOR = (r: number) =>
  r >= 8 ? 'text-red-400' : r >= 5 ? 'text-yellow-400' : 'text-green-400'

export default function Users() {
  const qc = useQueryClient()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'member' | 'admin'>('member')
  const [showInvite, setShowInvite] = useState(false)

  const { data: teamData } = useQuery({
    queryKey: ['team', ORG_ID],
    queryFn: () => getTeam(ORG_ID),
    enabled: !!ORG_ID,
  })

  const { data: activityData, isLoading } = useQuery({
    queryKey: ['users-activity', ORG_ID],
    queryFn: () => getDashboardUsers(ORG_ID, 7),
    enabled: !!ORG_ID,
  })

  const { mutate: invite, isPending: inviting } = useMutation({
    mutationFn: () => inviteMember({
      org_id: ORG_ID,
      email: inviteEmail,
      role: inviteRole,
      invited_by_name: 'Admin',
      org_name: 'Your Team',
    }),
    onSuccess: () => {
      toast.success(`Invite sent to ${inviteEmail}`)
      setInviteEmail('')
      setShowInvite(false)
      qc.invalidateQueries({ queryKey: ['team', ORG_ID] })
    },
    onError: (e) => toast.error((e as Error).message),
  })

  const { mutate: remove } = useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      toast.success('Member removed')
      qc.invalidateQueries({ queryKey: ['team', ORG_ID] })
    },
  })

  const userActivity = activityData?.users ?? []
  const members = teamData?.members ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Activity</h1>
          <p className="text-muted-foreground text-sm mt-1">Who's sending what to AI, ranked by risk.</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-crystal text-white text-sm font-medium">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-semibold mb-6">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-card/40 border border-border/60 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Role</label>
                <div className="flex gap-2">
                  {(['member', 'admin'] as const).map((r) => (
                    <button key={r} onClick={() => setInviteRole(r)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize
                        ${inviteRole === r
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'bg-transparent border-border/40 text-muted-foreground hover:text-foreground'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowInvite(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button onClick={() => invite()} disabled={!inviteEmail || inviting}
                  className="flex-1 py-2.5 rounded-xl btn-crystal text-white text-sm font-medium disabled:opacity-50">
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <h2 className="text-sm font-semibold">Risk by Team Member</h2>
          <p className="text-xs text-muted-foreground font-mono">Last 7 days · sorted by risk score</p>
        </div>
        <div className="divide-y divide-border/20">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted/30 animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-32 bg-muted/30 animate-pulse rounded" />
                  <div className="h-2 w-20 bg-muted/20 animate-pulse rounded" />
                </div>
              </div>
            ))
          ) : userActivity.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground text-sm">
              No activity yet. Install the extension and connect your team.
            </div>
          ) : (
            userActivity.map((user, i) => {
              const member = members.find((m) =>
                m.email.toLowerCase().includes(user.user_hash.slice(0, 4))
              )

              return (
                <div key={user.user_hash} className="px-6 py-4 flex items-center gap-4 hover:bg-primary/5 transition-colors">
                  {/* Rank */}
                  <span className="text-xs text-muted-foreground font-mono w-5 flex-shrink-0">{i + 1}</span>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary font-mono">
                      {user.user_hash.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member?.email ?? `User ${user.user_hash.slice(0, 8)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.providers.join(', ')} · Top risk: <span className="text-foreground">{user.top_type}</span>
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-mono text-foreground">{user.event_count} calls</p>
                    {user.blocked_count > 0 && (
                      <p className="text-xs text-red-400 flex items-center gap-1 justify-end">
                        <AlertTriangle className="w-3 h-3" /> {user.blocked_count} blocked
                      </p>
                    )}
                  </div>

                  {/* Risk score */}
                  <div className={`text-2xl font-bold font-mono flex-shrink-0 ${RISK_COLOR(user.avg_risk)}`}>
                    {user.avg_risk}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Members list */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <h2 className="text-sm font-semibold">Team Members</h2>
          <p className="text-xs text-muted-foreground font-mono">{members.length} members</p>
        </div>
        <div className="divide-y divide-border/20">
          {members.map((m) => (
            <div key={m.id} className="px-6 py-3.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-foreground">{m.email[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{m.email}</p>
                <p className="text-xs text-muted-foreground">{m.joined_at ? 'Active' : 'Invite pending'}</p>
              </div>
              {m.role === 'admin' && (
                <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  <Crown className="w-3 h-3" /> Admin
                </span>
              )}
              <button onClick={() => remove(m.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
