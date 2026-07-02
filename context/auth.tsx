'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
interface AuthCtx { isUnlocked: boolean; unlock: (c: string) => Promise<{ ok: boolean; error?: string }>; lock: () => void; getHeaders: () => Record<string, string> }
const Ctx = createContext<AuthCtx | null>(null)
const KEY = 'perf_access_code'
export function AuthProvider({ children }: { children: ReactNode }) {
  const [passcode, setPasscode] = useState('')
  useEffect(() => { const s = sessionStorage.getItem(KEY); if (s) setPasscode(s) }, [])
  async function unlock(code: string) {
    const res = await fetch('/api/auth/validate', { method: 'POST', headers: { 'x-access-code': code } })
    if (res.ok) { setPasscode(code); sessionStorage.setItem(KEY, code); return { ok: true } }
    return { ok: false, error: 'Invalid passcode' }
  }
  function lock() { setPasscode(''); sessionStorage.removeItem(KEY) }
  return <Ctx.Provider value={{ isUnlocked: !!passcode, unlock, lock, getHeaders: () => (passcode ? { 'x-access-code': passcode } : {}) as Record<string, string> }}>{children}</Ctx.Provider>
}
export function useAuth() { const c = useContext(Ctx); if (!c) throw new Error('useAuth outside AuthProvider'); return c }
