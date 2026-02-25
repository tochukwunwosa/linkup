"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Sheet = dynamic(
  () => import('@/components/ui/sheet').then((m) => ({ default: m.Sheet })),
  { ssr: false }
);
const SheetContent = dynamic(
  () => import('@/components/ui/sheet').then((m) => ({ default: m.SheetContent })),
  { ssr: false }
);
const SheetTrigger = dynamic(
  () => import('@/components/ui/sheet').then((m) => ({ default: m.SheetTrigger })),
  { ssr: false }
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/#events", label: "Events" },
    { href: "/my-submissions", label: "Track Submissions" },
  ];

  // Match active link: exact for most routes, hash links match by pathname "/"
  const isActive = (href: string) => {
    if (href.includes('#')) return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled ? "nav-scrolled pt-[env(safe-area-inset-top)]" : "nav-over-hero"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-999 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Go to homepage">
              <Image
                src="/logo.svg"
                alt="Tech LinkUp Logo"
                width={32}
                height={32}
                className={cn(
                  "transition-all duration-300",
                  scrolled ? "opacity-100" : "brightness-0 invert opacity-90"
                )}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    "relative font-medium text-sm tracking-wide transition-colors duration-300",
                    // Underline bar
                    "after:absolute after:bottom-0.5 after:left-0 after:h-0.5 after:rounded-full",
                    "after:bg-[#c9f72f] after:transition-all after:duration-300",
                    // Active = full underline, inactive = 0 → full on hover
                    active ? "after:w-full" : "after:w-0 hover:after:w-full",
                    // Text color
                    scrolled
                      ? active
                        ? "text-[#0066cc] font-semibold"
                        : "text-gray-700 hover:text-[#0066cc]"
                      : active
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <Button
              asChild
              className={cn(
                "ml-2 text-sm font-semibold transition-all duration-300",
                scrolled
                  ? "bg-[#0066cc] text-white hover:bg-[#0052a3]"
                  : "bg-[#c9f72f] text-[#070809] hover:bg-[#dbff45] border-0"
              )}
            >
              <Link href="/submit-event">
                <Plus className="mr-2 h-4 w-4" />
                Submit Event
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <Button
              asChild
              size="sm"
              className={cn(
                "text-xs font-semibold transition-all duration-300",
                scrolled
                  ? "bg-[#0066cc] text-white hover:bg-[#0052a3]"
                  : "bg-[#c9f72f] text-[#070809] hover:bg-[#dbff45] border-0"
              )}
            >
              <Link href="/submit-event">
                <Plus className="mr-1 h-3 w-3" />
                Submit
              </Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  className={cn(
                    "md:hidden",
                    scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                  )}
                >
                  {isOpen ? <X /> : <Menu />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-62.5 p-4">
                <nav className="flex flex-col space-y-4 mt-10" aria-label="Mobile navigation">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          "text-lg font-medium transition-colors",
                          active
                            ? "text-[#0066cc] font-semibold border-l-2 border-[#c9f72f] pl-3"
                            : "hover:text-primary pl-3"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full">
                      <Link href="/submit-event" onClick={() => setIsOpen(false)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Submit Event
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}