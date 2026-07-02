'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (!sessionStorage.getItem('perf_disclaimer_dismissed')) setVisible(true) }, [])
  if (!visible) return null
  return (
    <div className="w-full flex items-center justify-between gap-4 px-4 py-2.5" style={{ background: 'rgba(249,115,22,0.1)', borderBottom: '1px solid rgba(249,115,22,0.2)', color: '#FDBA74' }}>
      <p className="flex-1 text-center text-xs"><strong>AI-generated test plans</strong> are a starting point — validate scripts against your actual environment, adjust VU counts to your infrastructure capacity, and never run load tests against production without approval.</p>
      <button onClick={() => { sessionStorage.setItem('perf_disclaimer_dismissed', '1'); setVisible(false) }} className="shrink-0 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  )
}
