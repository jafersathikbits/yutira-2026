'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/workshop', label: 'Workshop' },
  { href: '/paper', label: 'Paper' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' }
];

function isActive(pathname, href) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null); // null = unknown/logged out, 'user' | 'admin'

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  // Know whether someone is logged in, to show Dashboard instead of Login/Register.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => !cancelled && setRole(d?.role || null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const dashHref = role === 'admin' ? '/admin' : '/dashboard';

  const authButtons = role ? (
    <Link href={dashHref} className="btn-primary btn-sm">
      {role === 'admin' ? 'Admin' : 'Dashboard'}
    </Link>
  ) : (
    <>
      <Link href="/register" className="btn-primary btn-sm">
        Register
      </Link>
      <Link href="/login" className="btn-ghost btn-sm">
        Login
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 btn-primary btn-sm"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Yutira 2026 home">
          <Image
            src="/yutira-logo.jpeg"
            alt=""
            width={68}
            height={40}
            className="rounded-lg h-10 w-auto"
            priority
          />
          <div className="leading-tight hidden sm:block">
            <div className="font-semibold">Yutira 2026</div>
            <div className="text-xs text-white/60">Civil Engineering • PSG Tech</div>
          </div>
        </Link>

        <nav className="ml-auto hidden lg:flex items-center gap-1" aria-label="Main">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  active ? 'text-gold bg-white/5' : 'text-white/75 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto lg:ml-2 hidden sm:flex items-center gap-2">{authButtons}</div>

        <button
          type="button"
          className="lg:hidden ml-auto sm:ml-0 inline-grid place-items-center h-10 w-10 rounded-xl border border-white/15 hover:bg-white/10"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" className="lg:hidden border-t border-white/10 bg-ink/95" aria-label="Mobile">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-1">
            {links.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-3 rounded-xl text-sm ${active ? 'text-gold bg-white/5' : 'text-white/80 hover:bg-white/5'}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="mt-2 pt-3 border-t border-white/10 flex gap-2 sm:hidden [&>a]:flex-1">{authButtons}</div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
