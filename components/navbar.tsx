"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Lazy-load mobile Sheet — not needed on desktop, keeps it out of the critical bundle
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/#events", label: "Events" },
    { href: "/my-submissions", label: "Track Submissions" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-white/90 shadow-sm border-b border-gray-200/50"
          : "bg-white border-b border-gray-200 shadow-sm"
      )}
    >
      {/* Skip-to-content link — visible only on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-foreground">
              <Image src="/logo.svg" alt="Tech LinkUp Logo" width={32} height={32} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary font-medium transition-colors duration-300 ease-in-out"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="ml-2">
              <Link href="/submit-event">
                <Plus className="mr-2 h-4 w-4" />
                Submit Event
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4 mt-[env(safe-area-inset-top)]">
            <Button asChild size="sm" className="text-xs">
              <Link href="/submit-event">
                <Plus className="mr-1 h-3 w-3" />
                Submit
              </Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {isOpen ? <X /> : <Menu />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] p-4">
                <nav className="flex flex-col space-y-4 mt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
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
