import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AcceptInvite() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const token = params.get('token')

  useEffect(() => {
    if (!token) { setStatus('error'); return }

    fetch(`${import.meta.env.VITE_API_URL}/api/team/accept-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(async (res) => {
      if (!res.ok) throw new Error('Invalid or expired invite')
      const data = await res.json() as { org_id: string; email: string }
      localStorage.setItem('glasslm_org_id', data.org_id)
      setStatus('success')
      toast.success('Invite accepted! Please sign in.')
      setTimeout(() => navigate('/login'), 2000)
    }).catch(() => setStatus('error'))
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="glass-card p-10 rounded-2xl text-center max-w-sm animate-fade-in">
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Accepting invite...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-1">Invite accepted!</h2>
            <p className="text-muted-foreground text-sm">Redirecting to login...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-1">Invalid invite</h2>
            <p className="text-muted-foreground text-sm">This link may have expired. Ask your admin to resend.</p>
          </>
        )}
      </div>
    </div>
  )
}
