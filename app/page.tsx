'use client'
import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'
import Header from '@/components/Header'
import PasscodeModal from '@/components/PasscodeModal'
import PerfForm from '@/components/PerfForm'
import PerfReport from '@/components/PerfReport'
import { useAuth } from '@/context/auth'
import type { PerfInput, PerfOutput } from '@/lib/types'

const LOADING_STEPS = [
  'Analyzing endpoints and traffic patterns…',
  'Building load scenarios and stage configurations…',
  'Writing k6 script with thresholds…',
  'Generating JMeter plan and monitoring checklist…',
]

export default function Home() {
  const { getHeaders } = useAuth()
  const [showPasscode, setShowPasscode] = useState(false)
  const [output, setOutput] = useState<PerfOutput | null>(null)
  const [lastInput, setLastInput] = useState<PerfInput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)

  async function handleGenerate(input: PerfInput) {
    const headers = getHeaders()
    if (!headers['x-access-code']) { setShowPasscode(true); return }
    setIsLoading(true); setError(null); setOutput(null); setStepIdx(0)
    const interval = setInterval(() => setStepIdx(i => Math.min(i + 1, LOADING_STEPS.length - 1)), 3500)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(input),
      })
      clearInterval(interval)
      if (res.status === 401) { setShowPasscode(true); setIsLoading(false); return }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setLastInput(input); setOutput(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      clearInterval(interval); setIsLoading(false)
    }
  }

  return (
    <>
      <Header
        onShowPasscode={() => setShowPasscode(true)}
        onLock={() => { setOutput(null); setLastInput(null); setError(null) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="rounded-2xl p-10 text-center space-y-4 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'var(--accent-grad)' }}>
              <Zap size={28} className="text-white animate-pulse" />
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Generating Performance Test Plan</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{LOADING_STEPS[stepIdx]}</p>
            <div className="flex justify-center gap-1.5 pt-2">
              {LOADING_STEPS.map((_, i) => (
                <div key={i} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i <= stepIdx ? '24px' : '8px', background: i <= stepIdx ? 'var(--accent-orange)' : 'var(--border-default)' }} />
              ))}
            </div>
            <Loader2 size={20} className="animate-spin mx-auto mt-2" style={{ color: 'var(--text-dimmer)' }} />
          </div>
        )}

        {error && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        {output && lastInput && !isLoading
          ? <PerfReport output={output} input={lastInput} onReset={() => { setOutput(null); setLastInput(null) }} />
          : !isLoading && <PerfForm onGenerate={handleGenerate} isLoading={isLoading} />
        }
      </main>

      <footer className="text-center py-8 text-xs" style={{ color: 'var(--text-dimmer)' }}>
        <span>Developed by </span>
        Atul Sharma
        <span> · AI-generated plans need validation in staging before production use</span>
      </footer>

      {showPasscode && <PasscodeModal onClose={() => setShowPasscode(false)} onUnlocked={() => {}} />}
    </>
  )
}
