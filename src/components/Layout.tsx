import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { businesses, socials } from '../data'
import SilkBackground from './SilkBackground'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/businesses', label: 'Businesses' },
]

function Logo() {
  return (
    <Link to="/" className="font-display text-[24px] leading-none tracking-tight">
      Ferdz<span className="text-accent">.</span>
    </Link>
  )
}

const navLinkCls = (active: boolean) =>
  `relative text-[14px] tracking-[0.06em] transition-colors duration-200 hover:text-ink ${active ? 'text-ink' : 'text-muted'}`

function BusinessesMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const { pathname } = useLocation()
  const active = pathname.startsWith('/businesses')

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const show = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 150)
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${navLinkCls(active)} flex items-center gap-1`}
      >
        Businesses
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        {active && <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full pt-4"
          >
            <div className="hl-card w-[340px] p-2" role="menu">
              {businesses.map((b) => (
                <Link
                  key={b.slug}
                  to={`/businesses/${b.slug}`}
                  role="menuitem"
                  className={`flex gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none ${
                    pathname === `/businesses/${b.slug}` ? 'bg-white/5' : ''
                  }`}
                >
                  <span className="pt-0.5 text-[12px] tabular-nums text-accent">{b.index}</span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{b.name}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{b.tagline}</span>
                  </span>
                </Link>
              ))}
              <Link
                to="/businesses"
                role="menuitem"
                className="mt-1 flex items-center justify-between rounded-xl border-t border-white/10 px-3 py-3 text-[13px] text-muted transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:text-ink"
              >
                All businesses <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <SilkBackground />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? 'border-b border-line bg-bg/90 backdrop-blur' : 'border-b border-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {nav.filter((n) => n.to !== '/businesses').map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => navLinkCls(isActive)}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <BusinessesMenu />
          </nav>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="container-x flex flex-col gap-4 pb-8 pt-2">
                {nav.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.to === '/'} className="font-display text-[32px]">
                    {n.label}
                  </NavLink>
                ))}
                <div className="-mt-1 flex flex-col gap-3 border-l border-white/10 pl-4">
                  {businesses.map((b) => (
                    <NavLink
                      key={b.slug}
                      to={`/businesses/${b.slug}`}
                      className={({ isActive }) => `text-[17px] ${isActive ? 'text-accent' : 'text-muted'}`}
                    >
                      {b.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-line">
        <div className="container-x grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-muted">
              Barber. Creator. Entrepreneur. Building freedom through skills, from Hawaii to Phoenix.
            </p>
          </div>
          <div>
            <p className="label mb-4">Businesses</p>
            <ul className="space-y-2 text-[14px]">
              {businesses.map((b) => (
                <li key={b.slug}>
                  <Link to={`/businesses/${b.slug}`} className="text-muted transition-colors duration-200 hover:text-ink">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-4">Follow</p>
            <ul className="space-y-2 text-[14px]">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors duration-200 hover:text-ink">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container-x flex flex-col justify-between gap-2 border-t border-line py-6 text-[12px] text-muted md:flex-row">
          <span>© {new Date().getFullYear()} Ferdz. All rights reserved.</span>
          <span>Phoenix, AZ · Born in Hawaii 🌴</span>
        </div>
      </footer>
    </div>
  )
}
