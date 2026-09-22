"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const NAV_LINKS = [
  { href: "/", key: "menu.home" },
  { href: "/about", key: "menu.about" },
  { href: "/services", key: "menu.services" },
  { href: "/perkam-mezu", key: "menu.perkamMezu" },
  { href: "/perkam-cirsmu", key: "menu.perkamCirsmu" },
  { href: "/contact", key: "menu.contact" },
];

const LANGUAGES = [
  { code: 'lv', label: 'LV', name: 'Latviešu' },
  { code: 'en', label: 'EN', name: 'English' },
];

// Scroll distance below which the navbar always stays open
const TOP_OFFSET = 80;
// Movement needed before hiding/showing, so tiny jitters don't flip it
const SCROLL_DELTA = 5;

export default function Navbar({ onMenuToggle, isMenuOpen, setIsMenuOpen }) {
  const [isVisible, setIsVisible] = useState(true);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation('common');
  const currentLanguage =
    LANGUAGES.find((language) => language.code === router.locale) || LANGUAGES[0];

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    let lastY = 0;
    let ticking = false;

    // Locomotive Scroll (when it is running) moves a container instead of the
    // window, so window.scrollY stays at 0 - read its position instead.
    const readScrollY = () => {
      const locoY = window.locomotiveScroll?.scroll?.instance?.scroll?.y;
      return typeof locoY === 'number' ? locoY : window.scrollY;
    };

    const update = () => {
      ticking = false;
      const y = readScrollY();

      if (y < TOP_OFFSET) {
        setIsVisible(true);
      } else if (y > lastY + SCROLL_DELTA) {
        setIsVisible(false);
      } else if (y < lastY - SCROLL_DELTA) {
        setIsVisible(true);
      }

      lastY = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    lastY = readScrollY();
    window.addEventListener('scroll', onScroll, { passive: true });

    // The provider creates Locomotive a moment after mount, so keep looking
    // for it briefly and subscribe once it exists.
    let loco = null;
    const attachLocomotive = () => {
      if (loco || !window.locomotiveScroll) return;
      loco = window.locomotiveScroll;
      loco.on('scroll', onScroll);
      clearInterval(pollLoco);
    };
    const pollLoco = setInterval(attachLocomotive, 200);
    const stopPolling = setTimeout(() => clearInterval(pollLoco), 5000);
    attachLocomotive();

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(pollLoco);
      clearTimeout(stopPolling);
      loco?.off('scroll', onScroll);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (onMenuToggle) onMenuToggle(newState);
  }, [isMenuOpen, setIsMenuOpen, onMenuToggle]);

  return (
    <>
    <nav data-site-nav className={`bg-[#243c36] fixed top-0 left-0 right-0 w-full z-[50] transition-transform duration-300 ease-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}
    style={{
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
    }}>
      <div className="w-full px-4 sm:px-6 md:px-8 py-4 md:py-6">
        <div className="relative flex items-center justify-between">
          {/* Left side - Logo and company name */}
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src="/image/amforest-logo-white.svg"
              alt="AM Forest"
              className="h-10 md:h-12 lg:h-14 w-auto"
            />
            <div className="text-neutral-200 font-semibold text-lg md:text-xl lg:text-2xl whitespace-nowrap">
              Forest
            </div>
          </div>

          {/* Center - main navigation links */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-5 xl:gap-8">
            {NAV_LINKS.map(({ href, key }) => {
              const isActive =
                href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm xl:text-base whitespace-nowrap transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-[#dbf6a3] after:transition-all after:duration-300 ${
                    isActive
                      ? "text-[#dbf6a3] after:w-full"
                      : "text-neutral-200 hover:text-[#dbf6a3] after:w-0 hover:after:w-full"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </div>

          {/* Right side - full-height cells divided by hairlines */}
          <div className="flex items-center">
            {/* Language cell - matches the menu cell's height and divider */}
            <div
              className="relative h-18 md:h-24 lg:h-26 -my-4 md:-my-6 lg:-mr-8"
              ref={langDropdownRef}
            >
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Select language"
                aria-expanded={langDropdownOpen}
                className="h-full flex items-center gap-2 md:gap-2.5 px-4 md:px-6 border-l border-[#c7dccd] text-neutral-200 hover:bg-[#faf6ed]/10 transition-colors"
              >
                <span className="text-base md:text-lg lg:text-xl font-medium">
                  {currentLanguage.label}
                </span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown - hangs off the navbar's bottom rule */}
              {langDropdownOpen && (
                <div className="absolute top-full right-0 min-w-full bg-[#faf6ed] border-l border-b border-[#c7dccd] z-50">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        router.push(router.asPath, router.asPath, { locale: language.code });
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-4 md:px-6 py-3 text-left text-base md:text-lg whitespace-nowrap border-b border-[#c7dccd] last:border-b-0 transition-colors ${
                        router.locale === language.code
                          ? 'bg-[#dbf6a3] text-[#243c36]'
                          : 'text-[#243c36] hover:bg-[#dbf6a3]'
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

          <button
            onClick={toggleMenu}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="lg:hidden shrink-0 h-18 w-18 md:h-24 md:w-24 -my-4 md:-my-6 -mr-4 sm:-mr-6 md:-mr-8 flex items-center justify-center border-l border-[#c7dccd] hover:bg-[#faf6ed]/10 transition-colors"
          >
            <div className="flex w-6 flex-col gap-1.5">
              <div className="h-0.5 w-full bg-[#faf6ed] rounded-full"></div>
              <div className="h-0.5 w-full bg-[#faf6ed] rounded-full"></div>
              <div className="h-0.5 w-full bg-[#faf6ed] rounded-full"></div>
            </div>
          </button>
          </div>
        </div>
      </div>

      {/* Bottom border line */}
      <div className="w-full h-px bg-[#c7dccd]"></div>
    </nav>

    </>
  );
}