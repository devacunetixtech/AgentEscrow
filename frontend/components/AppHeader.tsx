'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WalletButton } from './WalletButton';

const links = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/jobs', label: 'Open Jobs' },
  { href: '/app/create-job', label: 'Create Job' },
  { href: '/app/my-jobs', label: 'My Jobs' },
  { href: '/app/history', label: 'History' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="appHeader">
      <div className="appHeaderMain">
        <Link className="brand brandLockup" href="/">
          <span className="brandMark">AE</span>
          <span>AgentEscrow</span>
        </Link>

        <nav className="appNav appNavDesktop" aria-label="App navigation">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'activeNavLink' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="appHeaderActions">
          <WalletButton compact />
          <button
            type="button"
            className={open ? 'menuButton menuButtonOpen' : 'menuButton'}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-app-menu"
            onClick={() => setOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-app-menu" className={open ? 'mobileMenu mobileMenuOpen' : 'mobileMenu'}>
        <nav className="mobileMenuNav" aria-label="Mobile app navigation">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'mobileMenuLink activeMobileLink' : 'mobileMenuLink'}
            >
              <span>{link.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
