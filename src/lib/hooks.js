// FILE: src/lib/hooks.js
import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'mpc-theme'
const SITE_NAME = 'MPC — Moldovan Professionals Chicago'

function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* storage unavailable (private mode etc.) — the choice just won't persist */
  }
}

/** Light/dark theme that follows the OS until the visitor picks one. */
export function useTheme() {
  const [choice, setChoice] = useState(() => readStorage(THEME_KEY) || 'system')
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const isDark = choice === 'dark' || (choice === 'system' && systemDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark'
    setChoice(next)
    writeStorage(THEME_KEY, next)
  }, [isDark])

  return { isDark, toggle }
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · MPC` : SITE_NAME
  }, [title])
}

/** Checklist state persisted per checklist id. */
export function useStoredSet(key) {
  const [set, setSet] = useState(() => {
    try {
      return new Set(JSON.parse(readStorage(key) || '[]'))
    } catch {
      return new Set()
    }
  })
  const update = useCallback(
    (next) => {
      setSet(next)
      writeStorage(key, next.size ? JSON.stringify([...next]) : null)
    },
    [key],
  )
  return [set, update]
}

/** Current vertical scroll position, throttled to animation frames. */
export function useScrollY() {
  const [y, setY] = useState(() => window.scrollY)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setY(window.scrollY)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return y
}
