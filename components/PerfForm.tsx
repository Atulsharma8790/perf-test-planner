'use client'
import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import type { PerfInput } from '@/lib/types'
import { EXAMPLE_INPUT, TEST_TYPES } from '@/lib/config'

interface Props { onGenerate: (input: PerfInput) => void; isLoading: boolean }

const EMPTY: PerfInput = {
  appName: '', appDescription: '', targetEndpoints: '',
  expectedUsers: '', peakConcurrent: '', rampUpSeconds: '120',
  slaP95: '500', slaP99: '1500', slaErrorRate: '1',
  testTypes: ['Smoke', 'Load'], additionalContext: '',
}

export default function PerfForm({ onGenerate, isLoading }: Props) {
  const [form, setForm] = useState<PerfInput>(EMPTY)
  function set<K extends keyof PerfInput>(k: K, v: PerfInput[K]) { setForm(f => ({ ...f, [k]: v })) }
  function toggleType(t: string) {
    setForm(f => ({ ...f, testTypes: f.testTypes.includes(t) ? f.testTypes.filter(x => x !== t) : [...f.testTypes, t] }))
  }
  const canSubmit = form.appName.trim() && form.appDescription.trim() && form.targetEndpoints.trim() && form.testTypes.length > 0

  return (
    <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Application Details</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Describe your app — AI generates a complete k6 script, load scenarios, and SLA thresholds</p>
        </div>
        <button onClick={() => setForm(EXAMPLE_INPUT)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(249,115,22,0.1)', color: '#FDBA74', border: '1px solid rgba(249,115,22,0.25)' }}>
          <Sparkles size={12} /> Load Example
        </button>
      </div>

      {/* App info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>App / Service Name <span style={{ color: 'var(--accent-orange)' }}>*</span></label>
          <input value={form.appName} onChange={e => set('appName', e.target.value)} placeholder="e.g. ShopStream API" className="input-themed" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tech Stack & Architecture <span style={{ color: 'var(--accent-orange)' }}>*</span></label>
          <input value={form.appDescription} onChange={e => set('appDescription', e.target.value)} placeholder="e.g. Node.js REST API + PostgreSQL, deployed on AWS ECS, React SPA frontend…" className="input-themed" />
        </div>
      </div>

      {/* Endpoints */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Target Endpoints <span style={{ color: 'var(--accent-orange)' }}>*</span></label>
        <textarea value={form.targetEndpoints} onChange={e => set('targetEndpoints', e.target.value)} rows={5}
          placeholder={`/api/products  (GET — high traffic, public)\n/api/cart/add  (POST — authenticated)\n/api/checkout  (POST — critical, payment)`}
          className="input-themed resize-y font-mono text-xs" />
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-dimmer)' }}>One per line. Include method and brief description for best results.</p>
      </div>

      {/* Load numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Expected Total Users</label>
          <input type="number" value={form.expectedUsers} onChange={e => set('expectedUsers', e.target.value)} placeholder="5000" className="input-themed" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Peak Concurrent VUs</label>
          <input type="number" value={form.peakConcurrent} onChange={e => set('peakConcurrent', e.target.value)} placeholder="500" className="input-themed" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Ramp-Up (seconds)</label>
          <input type="number" value={form.rampUpSeconds} onChange={e => set('rampUpSeconds', e.target.value)} placeholder="120" className="input-themed" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Max Error Rate %</label>
          <input type="number" step="0.1" value={form.slaErrorRate} onChange={e => set('slaErrorRate', e.target.value)} placeholder="1" className="input-themed" />
        </div>
      </div>

      {/* SLA targets */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>SLA — p95 Response (ms)</label>
          <input type="number" value={form.slaP95} onChange={e => set('slaP95', e.target.value)} placeholder="500" className="input-themed" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>SLA — p99 Response (ms)</label>
          <input type="number" value={form.slaP99} onChange={e => set('slaP99', e.target.value)} placeholder="1500" className="input-themed" />
        </div>
      </div>

      {/* Test types */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Test Types to Generate <span style={{ color: 'var(--accent-orange)' }}>*</span></label>
        <div className="flex flex-wrap gap-2">
          {TEST_TYPES.map(t => {
            const active = form.testTypes.includes(t)
            return (
              <button key={t} type="button" onClick={() => toggleType(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={active
                  ? { background: 'rgba(249,115,22,0.15)', color: '#FDBA74', border: '1px solid rgba(249,115,22,0.4)' }
                  : { background: 'var(--bg-elevated)', color: 'var(--text-dimmer)', border: '1px solid var(--border-default)' }}>
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Additional context */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Additional Context <span style={{ color: 'var(--text-dimmer)' }}>(optional)</span></label>
        <textarea value={form.additionalContext} onChange={e => set('additionalContext', e.target.value)} rows={2}
          placeholder="Flash sale expected? Auth required? Specific concerns? Autoscaling configured?"
          className="input-themed resize-y" />
      </div>

      <button onClick={() => onGenerate(form)} disabled={!canSubmit || isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40"
        style={{ background: 'var(--accent-grad)' }}>
        {isLoading
          ? <><Loader2 size={16} className="animate-spin" /> Generating Test Plan…</>
          : <><Sparkles size={16} /> Generate Performance Test Plan</>}
      </button>
    </div>
  )
}
