import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Key, Plus, Copy, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { getApiKeys, createApiKey, revokeApiKey } from '../lib/api'
import { toast } from 'sonner'
import { format } from 'date-fns'

const ORG_ID = localStorage.getItem('glasslm_org_id') ?? ''

export default function ApiKeys() {
  const qc = useQueryClient()
  const [label, setLabel] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['api-keys', ORG_ID],
    queryFn: () => getApiKeys(ORG_ID),
    enabled: !!ORG_ID,
  })

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () => createApiKey(ORG_ID, label),
    onSuccess: (data) => {
      setNewKey(data.key)
      setLabel('')
      qc.invalidateQueries({ queryKey: ['api-keys', ORG_ID] })
    },
    onError: () => toast.error('Failed to create key'),
  })

  const { mutate: revoke } = useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      toast.success('Key revoked')
      qc.invalidateQueries({ queryKey: ['api-keys', ORG_ID] })
    },
  })

  function copyKey(key: string) {
    navigator.clipboard.writeText(key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeKeys = (data?.keys ?? []).filter((k) => !k.revoked_at)
  const revokedKeys = (data?.keys ?? []).filter((k) => k.revoked_at)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">API Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Use these keys to connect the extension or integrate the GlassLM gateway.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-crystal text-white text-sm font-medium">
          <Plus className="w-4 h-4" />
          New API Key
        </button>
      </div>

      {/* New key reveal — shown once immediately after creation */}
      {newKey && (
        <div className="glass-card p-6 rounded-2xl border border-primary/30 animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Save this key — it won't be shown again</p>
              <p className="text-xs text-muted-foreground mt-0.5">Copy it now and store it securely.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-card/60 rounded-xl px-4 py-3 font-mono text-sm border border-border/40">
            <Key className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 truncate text-foreground">{newKey}</span>
            <button onClick={() => copyKey(newKey)}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors flex-shrink-0">
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button onClick={() => setNewKey(null)}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
            I've saved it — dismiss
          </button>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-semibold mb-6">Create API Key</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Label</label>
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Production Extension"
                  className="w-full px-4 py-3 rounded-xl bg-card/40 border border-border/60 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div className="glass-card p-4 rounded-xl text-xs text-muted-foreground space-y-1">
                <p>• Gateway key format: <span className="font-mono text-primary">glm_xxxxxxxxxxxxxxxx</span></p>
                <p>• Use as <span className="font-mono">Authorization: Bearer glm_xxx</span> header</p>
                <p>• Pass your provider key as <span className="font-mono">X-Provider-Key</span></p>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button onClick={() => { create(); setShowCreate(false) }} disabled={!label || creating}
                  className="flex-1 py-2.5 rounded-xl btn-crystal text-white text-sm font-medium disabled:opacity-50">
                  {creating ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active keys */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <h2 className="text-sm font-semibold">Active Keys</h2>
        </div>
        <div className="divide-y divide-border/20">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : activeKeys.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground text-sm">
              No active keys. Create one to connect the extension or gateway.
            </div>
          ) : (
            activeKeys.map((k) => (
              <div key={k.id} className="px-6 py-4 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Key className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{k.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{k.key_prefix}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Created {format(new Date(k.created_at), 'MMM d, yyyy')}</p>
                  {k.last_used_at && <p>Last used {format(new Date(k.last_used_at), 'MMM d')}</p>}
                </div>
                <button onClick={() => revoke(k.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Gateway usage example */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-sm font-semibold mb-4">Gateway Integration</h2>
        <p className="text-xs text-muted-foreground mb-3">Change one line in your code to route all AI calls through GlassLM:</p>
        <pre className="bg-card/60 rounded-xl p-4 text-xs font-mono text-primary overflow-x-auto border border-border/30">
{`# Python (OpenAI SDK)
import openai
client = openai.OpenAI(
    base_url="https://gateway.glasslm.space/openai",
    api_key="glm_your_key_here",  # GlassLM key
    default_headers={"X-Provider-Key": "sk-your-openai-key"}
)

# Node.js (OpenAI SDK)
import OpenAI from "openai";
const client = new OpenAI({
    baseURL: "https://gateway.glasslm.space/openai",
    apiKey: "glm_your_key_here",
    defaultHeaders: { "X-Provider-Key": "sk-your-openai-key" }
});`}
        </pre>
      </div>
    </div>
  )
}
