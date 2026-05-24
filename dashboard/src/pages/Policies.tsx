import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Shield, Info } from 'lucide-react'
import { getPolicies, upsertPolicy, type Policy } from '../lib/api'
import { toast } from 'sonner'

const ORG_ID = localStorage.getItem('glasslm_org_id') ?? ''

const ALL_TYPES = [
  { type: 'EMAIL', label: 'Email Addresses', desc: 'Personal and work emails', severity: 'medium' },
  { type: 'PHONE', label: 'Phone Numbers', desc: 'Mobile and landline numbers', severity: 'medium' },
  { type: 'SSN', label: 'Social Security Numbers', desc: 'Government identity numbers', severity: 'critical' },
  { type: 'CREDIT_CARD', label: 'Credit / Debit Cards', desc: 'Payment card numbers', severity: 'critical' },
  { type: 'API_KEY', label: 'API Keys', desc: 'Service and provider API tokens', severity: 'critical' },
  { type: 'ACCESS_TOKEN', label: 'Access Tokens', desc: 'JWT and OAuth bearer tokens', severity: 'high' },
  { type: 'PRIVATE_KEY', label: 'Private Keys', desc: 'RSA, SSH, and EC private keys', severity: 'critical' },
  { type: 'CLOUD_CREDENTIAL', label: 'Cloud Credentials', desc: 'AWS, GCP, Azure keys', severity: 'critical' },
  { type: 'DATABASE_URL', label: 'Database URLs', desc: 'Connection strings with credentials', severity: 'high' },
  { type: 'IP_ADDRESS', label: 'IP Addresses', desc: 'Internal and external IPs', severity: 'low' },
  { type: 'NAME', label: 'Personal Names', desc: 'First and last names', severity: 'low' },
]

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
}

export default function Policies() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['policies', ORG_ID],
    queryFn: () => getPolicies(ORG_ID),
    enabled: !!ORG_ID,
  })

  const { mutate: savePolicy } = useMutation({
    mutationFn: upsertPolicy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['policies', ORG_ID] })
      toast.success('Policy saved')
    },
    onError: () => toast.error('Failed to save policy'),
  })

  const policyMap = Object.fromEntries(
    (data?.policies ?? []).map((p) => [p.data_type, p])
  )

  function handleAction(type: string, action: Policy['action']) {
    const current = policyMap[type]
    if (current?.action === action && current.enabled) {
      // Toggle off
      savePolicy({ org_id: ORG_ID, data_type: type, action, enabled: false })
    } else {
      savePolicy({ org_id: ORG_ID, data_type: type, action, enabled: true })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Privacy Policies</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Control what happens when sensitive data is detected in your team's AI messages.
        </p>
      </div>

      {/* Legend */}
      <div className="glass-card p-4 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="text-yellow-400 font-medium">Warn</span> — Employee sees a warning but can proceed.</p>
          <p><span className="text-red-400 font-medium">Block</span> — Message is blocked entirely from reaching the AI.</p>
          <p><span className="text-purple-400 font-medium">Redact</span> — Data is automatically replaced with placeholders (default GlassLM behavior).</p>
        </div>
      </div>

      {/* Policy rows */}
      <div className="space-y-3">
        {ALL_TYPES.map(({ type, label, desc, severity }) => {
          const policy = policyMap[type]
          const activeAction = policy?.enabled ? policy.action : null

          return (
            <div key={type} className="glass-card p-5 rounded-xl flex items-center gap-4">
              {/* Severity badge */}
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border flex-shrink-0 ${SEVERITY_COLORS[severity]}`}>
                {severity}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {(['warn', 'block', 'redact'] as const).map((action) => (
                  <button key={action}
                    onClick={() => handleAction(type, action)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 capitalize
                      ${activeAction === action
                        ? action === 'warn'
                          ? 'bg-yellow-400/15 border-yellow-400/40 text-yellow-400'
                          : action === 'block'
                          ? 'bg-red-400/15 border-red-400/40 text-red-400'
                          : 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-transparent border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
                      }`}>
                    {action}
                  </button>
                ))}
              </div>

              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeAction ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
