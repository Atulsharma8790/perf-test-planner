'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
type Theme = 'dark' | 'light'
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} })
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => { const s = localStorage.getItem('perf_theme') as Theme | null; if (s) setTheme(s) }, [])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('perf_theme', theme) }, [theme])
  return <Ctx.Provider value={{ theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>{children}</Ctx.Provider>
}
export const useTheme = () => useContext(Ctx)
