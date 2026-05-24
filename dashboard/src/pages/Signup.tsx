import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Building2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', org_name: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }

    setLoading(true)
    try {
      // 1. Create Supabase auth user
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name } },
      })
      if (error) throw error

      // 2. Create org via backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name, org_name: form.org_name }),
      })
      const json = await res.json() as { org_id: string; extension_key: string }

      // Store org_id + extension key for the user
      localStorage.setItem('glasslm_org_id', json.org_id)

      toast.success('Account created! Check your email to verify.')
      navigate('/dashboard')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(270 70% 65%) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl btn-crystal flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold font-mono text-lg">G</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === 1 ? 'Create your account' : 'Name your team'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {step === 1 ? 'Start protecting your team\'s AI usage' : 'Your organization\'s GlassLM workspace'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary' : 'bg-border/40'}`} />
          ))}
        </div>

        <div className="glass-card p-8 rounded-2xl">
          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 ? (
              <>
                <Field icon={<User />} label="Full Name" type="text" value={form.name} onChange={set('name')} placeholder="Your name" />
                <Field icon={<Mail />} label="Work Email" type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" />
                <Field icon={<Lock />} label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Min 8 characters" />
              </>
            ) : (
              <Field icon={<Building2 />} label="Company / Team Name" type="text" value={form.org_name} onChange={set('org_name')} placeholder="Acme Inc." />
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl btn-crystal text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Creating account...' : step === 1 ? 'Continue →' : 'Create Team'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

function Field({ icon, label, type, value, onChange, placeholder }: {
  icon: React.ReactNode; label: string; type: string
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        <input type={type} value={value} onChange={onChange} required placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/40 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
      </div>
    </div>
  )
}
