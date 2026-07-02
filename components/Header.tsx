'use client'
import { Sun, Moon, Lock, Unlock, ExternalLink } from 'lucide-react'
import { useTheme } from '@/context/theme'
import { useAuth } from '@/context/auth'
import { PORTFOLIO_URL } from '@/lib/config'
interface Props { onShowPasscode: () => void; onLock?: () => void }
export default function Header({ onShowPasscode, onLock }: Props) {
  const { theme, toggle } = useTheme()
  const { isUnlocked, lock } = useAuth()
  function handleLock() { lock(); onLock?.() }
  return (
    <header className="sticky top-0 z-40" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-default)' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-xl font-black" style={{ background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚡ Perf Test Planner</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--accent-orange)' }}>AI · k6 + JMeter</span>
          <span className="hidden sm:inline text-xs ml-1" style={{ color: 'var(--text-dimmer)' }}>· by Atul Sharma</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
            Portfolio <ExternalLink size={11} />
          </a>
          {isUnlocked ? (
            <button onClick={handleLock} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold" style={{ background: 'rgba(249,115,22,0.15)', color: '#FDBA74', border: '2px solid rgba(249,115,22,0.5)' }}><Unlock size={14} /> Unlocked</button>
          ) : (
            <button onClick={onShowPasscode} className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#DC2626,#EF4444)', boxShadow: '0 0 12px rgba(239,68,68,0.4)' }}>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
            <Lock size={14} /> Locked
          </button>
          )}
          <button onClick={toggle} className="p-2 rounded-lg" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  )
}
