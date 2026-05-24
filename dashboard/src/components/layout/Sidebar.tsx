import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Shield, Key, FileText,
  Settings, LogOut, ExternalLink,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { clsx } from 'clsx'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/users', label: 'Team Activity', icon: Users },
  { to: '/policies', label: 'Policies', icon: Shield },
  { to: '/keys', label: 'API Keys', icon: Key },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-border/50"
      style={{ background: 'linear-gradient(180deg, hsl(260 25% 8%) 0%, hsl(260 20% 6%) 100%)' }}>

      {/* Logo */}
      <div className="px-5 py-6 border-b border-border/30">
        <a href="https://glasslm.space" target="_blank" rel="noreferrer"
          className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg btn-crystal flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">G</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">GlassLM</p>
            <p className="text-xs text-muted-foreground font-mono">Team Dashboard</p>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground/40 ml-auto group-hover:text-primary transition-colors" />
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => clsx('sidebar-item', isActive && 'active')}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border/30 space-y-1">
        <a href="https://glasslm.space/pricing" target="_blank" rel="noreferrer"
          className="sidebar-item flex">
          <Shield className="w-4 h-4" />
          <span>Upgrade Plan</span>
          <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-mono">Free</span>
        </a>
        <button onClick={handleSignOut} className="sidebar-item w-full text-left">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
