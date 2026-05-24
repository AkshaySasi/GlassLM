import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Shield, AlertTriangle, Ban, TrendingUp, ChevronDown } from 'lucide-react'
import { getDashboardSummary } from '../lib/api'

const ORG_ID = localStorage.getItem('glasslm_org_id') ?? ''

const DAYS_OPTIONS = [7, 14, 30]

const TYPE_LABELS: Record<string, string> = {
  EMAIL: 'Emails', PHONE: 'Phone Numbers', SSN: 'SSNs',
  CREDIT_CARD: 'Credit Cards', API_KEY: 'API Keys',
  ACCESS_TOKEN: 'Access Tokens', PRIVATE_KEY: 'Private Keys',
  CLOUD_CREDENTIAL: 'Cloud Credentials', DATABASE_URL: 'DB URLs',
  IP_ADDRESS: 'IP Addresses', NAME: 'Names',
}

export default function Dashboard() {
  const [days, setDays] = useState(7)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', ORG_ID, days],
    queryFn: () => getDashboardSummary(ORG_ID, days),
    enabled: !!ORG_ID,
  })

  const timelineData = data
    ? Object.entries(data.timeline)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date: date.slice(5), count }))
    : []

  const typeData = data
    ? Object.entries(data.type_counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([type, count]) => ({ type: TYPE_LABELS[type] ?? type, count }))
    : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Privacy Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your team's AI usage, masked and monitored.
          </p>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl cursor-pointer group">
          <span className="text-sm font-mono text-muted-foreground">Last {days} days</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
          <div className="absolute mt-24 glass-card rounded-xl overflow-hidden hidden group-focus-within:block">
            {DAYS_OPTIONS.map((d) => (
              <button key={d} onClick={() => setDays(d)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                Last {d} days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="AI Calls" value={data?.total_events ?? 0}
          icon={<TrendingUp className="w-5 h-5" />}
          loading={isLoading} color="primary"
        />
        <StatCard
          label="With PII" value={data?.events_with_pii ?? 0}
          icon={<Shield className="w-5 h-5" />}
          loading={isLoading} color="warning"
        />
        <StatCard
          label="Blocked" value={data?.blocked ?? 0}
          icon={<Ban className="w-5 h-5" />}
          loading={isLoading} color="destructive"
        />
        <StatCard
          label="Avg Risk" value={data ? `${data.avg_risk}/10` : '–'}
          icon={<AlertTriangle className="w-5 h-5" />}
          loading={isLoading} color={data && data.avg_risk >= 7 ? 'destructive' : 'success'}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="glass-card p-6 rounded-2xl col-span-2">
          <h2 className="text-sm font-semibold text-foreground mb-1">AI Activity</h2>
          <p className="text-xs text-muted-foreground mb-5 font-mono">Calls per day, last {days} days</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(270 70% 65%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(270 70% 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 20% 18%)" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(270 15% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(270 15% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(260 25% 10%)', border: '1px solid hsl(270 20% 18%)', borderRadius: 12, color: 'hsl(270 20% 95%)' }}
                labelStyle={{ color: 'hsl(270 15% 55%)', fontSize: 11 }}
              />
              <Area type="monotone" dataKey="count" stroke="hsl(270 70% 65%)" fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Data Types */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-sm font-semibold text-foreground mb-1">Top Risk Types</h2>
          <p className="text-xs text-muted-foreground mb-5 font-mono">Most masked categories</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeData} layout="vertical">
              <XAxis type="number" tick={{ fill: 'hsl(270 15% 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="type" type="category" tick={{ fill: 'hsl(270 15% 55%)', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{ background: 'hsl(260 25% 10%)', border: '1px solid hsl(270 20% 18%)', borderRadius: 12 }}
                labelStyle={{ color: 'hsl(270 15% 55%)', fontSize: 11 }}
              />
              <Bar dataKey="count" fill="hsl(270 70% 65%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provider breakdown */}
      {data?.provider_counts && Object.keys(data.provider_counts).length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-sm font-semibold text-foreground mb-4">AI Providers Used</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(data.provider_counts)
              .sort(([, a], [, b]) => b - a)
              .map(([provider, count]) => (
                <div key={provider}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/30">
                  <span className="text-sm font-medium capitalize">{provider}</span>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, loading, color }: {
  label: string; value: string | number; icon: React.ReactNode
  loading: boolean; color: 'primary' | 'warning' | 'destructive' | 'success'
}) {
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    warning: 'text-yellow-400 bg-yellow-400/10',
    destructive: 'text-red-400 bg-red-400/10',
    success: 'text-green-400 bg-green-400/10',
  }

  return (
    <div className="glass-card p-5 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
      {loading
        ? <div className="h-8 w-16 bg-muted/30 animate-pulse rounded-lg" />
        : <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      }
    </div>
  )
}
