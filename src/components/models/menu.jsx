"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const MENU_LINKS = [
  { href: "/", key: "menu.home" },
  { href: "/about", key: "menu.about" },
  { href: "/services", key: "menu.services" },
  { href: "/perkam-mezu", key: "menu.perkamMezu" },
  { href: "/perkam-cirsmu", key: "menu.perkamCirsmu" },
  { href: "/contact", key: "menu.contact" },
];

export default function MenuModal({ isOpen, onClose }) {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll while the menu is open
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <div
      className="fixed inset-0 z-[19999] bg-[#faf6ed]"
      style={{
        transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
        WebkitTransform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        WebkitTransition: '-webkit-transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        visibility: isOpen ? 'visible' : 'hidden',
        transitionProperty: 'transform, visibility',
      }}
      aria-hidden={!isOpen}
    >
      <div className="h-full flex flex-col">
        {/* Header row - close cell mirrors the navbar's menu cell */}
        <div className="flex items-center justify-end h-18 md:h-24 border-b border-[#2a2a2a]">
          <button
            onClick={onClose}
            className="h-full w-18 md:w-24 flex items-center justify-center border-l border-[#2a2a2a] hover:bg-[#dbf6a3] transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-7 h-7 md:w-8 md:h-8 text-[#2a2a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links - one full-width line each */}
        <nav className="relative w-full flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {MENU_LINKS.map(({ href, key }) => {
            const isActive =
              href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`block w-full px-6 sm:px-8 py-6 text-2xl sm:text-3xl font-light border-b border-[#2a2a2a] transition-colors ${
                  isActive
                    ? 'bg-[#dbf6a3] text-[#243c36]'
                    : 'text-[#2a2a2a] hover:bg-[#dbf6a3] hover:text-[#243c36]'
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
