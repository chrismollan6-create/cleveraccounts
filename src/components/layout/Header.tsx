"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { NAV_LINKS, COMPANY } from "@/lib/constants";

type NavChild = { label: string; href: string };
type NavSection = { heading: string; items: NavChild[] };
type NavLink = {
  label: string;
  href: string;
  children?: NavChild[];
  sections?: NavSection[];
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-dark text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p>Online Accounting Services for Sole Traders, Limited Companies & Contractors</p>
          <a href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
            <Phone size={14} />
            Call Free: {COMPANY.freephone}
          </a>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-18">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="Clever Accounts" width={160} height={48} className="h-10 md:h-12 w-auto rounded-lg" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {(NAV_LINKS as NavLink[]).map((link) => {
              const hasSections = !!link.sections;
              const hasChildren = !!link.children;
              const isOpen = openDropdown === link.label;

              if (hasSections || hasChildren) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors rounded-lg hover:bg-surface"
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </Link>

                    {/* Mega menu — sections */}
                    {hasSections && (
                      <div
                        className={`absolute top-full left-0 bg-white rounded-2xl shadow-xl border border-border transition-all duration-200 ${
                          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                        }`}
                        style={{ minWidth: "520px" }}
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="grid grid-cols-2 gap-0 p-3">
                          {link.sections!.map((section, si) => (
                            <div key={section.heading} className={`p-2 ${si === 0 ? "border-r border-border" : ""}`}>
                              <p className="text-xs font-bold uppercase tracking-widest text-text-light px-2 pb-2 pt-1">
                                {section.heading}
                              </p>
                              {section.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="block px-2 py-2 text-sm text-text hover:text-primary hover:bg-surface rounded-lg transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Simple dropdown — flat children */}
                    {hasChildren && !hasSections && (
                      <div
                        className={`absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-border p-2 transition-all duration-200 ${
                          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                        }`}
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {link.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-3 py-2.5 text-sm text-text hover:text-primary hover:bg-surface rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors rounded-lg hover:bg-surface"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm font-medium text-text-light hover:text-primary transition-colors"
            >
              <Phone size={16} />
              {COMPANY.phone}
            </a>
            <Link
              href="/sign-up"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-text hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden overflow-y-auto" style={{ top: "72px" }}>
          <nav className="p-4 space-y-1">
            {(NAV_LINKS as NavLink[]).map((link) => (
              <div key={link.label}>
                {link.sections ? (
                  /* Accordion toggle for items with sections */
                  <div>
                    <button
                      type="button"
                      onClick={() => setOpenMobileSection(openMobileSection === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-dark hover:text-primary hover:bg-surface rounded-xl transition-colors"
                    >
                      {link.label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${openMobileSection === link.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openMobileSection === link.label && (
                      <div className="pl-4 pb-2">
                        {link.sections.map((section) => (
                          <div key={section.heading} className="mb-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-text-light px-4 py-1.5">
                              {section.heading}
                            </p>
                            {section.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2 text-sm text-text-light hover:text-primary hover:bg-surface rounded-lg transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : link.children ? (
                  /* Accordion toggle for items with flat children */
                  <div>
                    <button
                      type="button"
                      onClick={() => setOpenMobileSection(openMobileSection === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-dark hover:text-primary hover:bg-surface rounded-xl transition-colors"
                    >
                      {link.label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${openMobileSection === link.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openMobileSection === link.label && (
                      <div className="pl-4 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 text-sm text-text-light hover:text-primary hover:bg-surface rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Plain link — no children */
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-base font-semibold text-dark hover:text-primary hover:bg-surface rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 space-y-3 border-t border-border mt-4">
              <a
                href={`tel:${COMPANY.freephone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-primary border-2 border-primary rounded-xl"
              >
                <Phone size={18} />
                Call Free: {COMPANY.freephone}
              </a>
              <Link
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-base font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
