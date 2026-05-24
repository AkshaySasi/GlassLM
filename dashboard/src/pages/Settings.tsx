import { useState } from 'react'
import { Building2, CreditCard, ExternalLink, Trash2, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  { id: 'free', name: 'Free', price: '₹0', tokens: '25K tokens/mo', users: '1 user', cta: null },
  { id: 'starter', name: 'Starter', price: '₹749/mo', tokens: '1M tokens/mo', users: '5 users', cta: 'Upgrade' },
  { id: 'team', name: 'Team', price: '₹2,499/mo', tokens: '10M tokens/mo', users: '25 users', cta: 'Upgrade', popular: true },
  { id: 'business', name: 'Business', price: '₹6,799/mo', tokens: '100M tokens/mo', users: 'Unlimited', cta: 'Upgrade' },
]

export default function Settings() {
  const navigate = useNavigate()
  const [orgName, setOrgName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [showDanger, setShowDanger] = useState(false)

  const currentPlan = 'free'

  async function handleSaveName() {
    if (!orgName.trim()) return
    setSavingName(true)
    await new Promise((r) => setTimeout(r, 500))
    setSavingName(false)
    toast.success('Organization name updated')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your organization and billing.</p>
      </div>

      {/* Organization */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Organization
        </h2>
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Organization Name</label>
            <div className="flex gap-3">
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)}
                placeholder="Your company name"
                className="flex-1 px-4 py-2.5 rounded-xl bg-card/40 border border-border/60 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
              <button onClick={handleSaveName} disabled={!orgName || savingName}
                className="px-4 py-2.5 rounded-xl btn-crystal text-white text-sm font-medium disabled:opacity-50">
                {savingName ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Billing */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Billing & Plan
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PLANS.map((plan) => (
            <div key={plan.id}
              className={`glass-card p-5 rounded-xl relative ${plan.id === currentPlan ? 'border-primary/40' : ''}`}>
              {plan.popular && (
                <span className="absolute -top-2.5 left-4 text-xs bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-medium">
                  Most Popular
                </span>
              )}
              <p className="text-sm font-bold text-foreground">{plan.name}</p>
              <p className="text-xl font-bold font-mono mt-1 text-crystal">{plan.price}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>• {plan.users}</p>
                <p>• {plan.tokens}</p>
                {plan.id !== 'free' && <p>• Full dashboard</p>}
                {(plan.id === 'team' || plan.id === 'business') && <p>• Policy enforcement</p>}
                {plan.id === 'business' && <p>• Compliance exports</p>}
              </div>
              {plan.id === currentPlan ? (
                <div className="mt-4 py-2 text-center text-xs text-primary font-mono">Current plan</div>
              ) : plan.cta ? (
                <button className="mt-4 w-full py-2 rounded-xl border border-primary/40 text-xs font-medium text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-1">
                  {plan.cta} <ExternalLink className="w-3 h-3" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Payments powered by Razorpay. Annual plans available — save 2 months.{' '}
          <a href="mailto:hello@glasslm.space" className="text-primary hover:underline">Contact us</a> for Enterprise.
        </p>
      </section>

      {/* Danger zone */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" /> Account
        </h2>
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-border/20">
          <button onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign out of this device
          </button>
          <div className="border-t border-border/20 pt-3">
            <button onClick={() => setShowDanger(!showDanger)}
              className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors">
              <Trash2 className="w-4 h-4" />
              Delete organization
            </button>
            {showDanger && (
              <p className="text-xs text-muted-foreground mt-2">
                To permanently delete your organization and all data, email <a href="mailto:hello@glasslm.space" className="text-primary">hello@glasslm.space</a> from your admin address.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
