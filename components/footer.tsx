'use client'

import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between lg:items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="w-6 font-bold text-primary">
              <span>LinkUp</span>
            </Link>
            <p className="text-muted-foreground text-xs mt-px">
              Community-driven tech event discovery
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link
              href="/submit-event"
              className="hover:text-primary transition-colors duration-300 ease-in-out"
            >
              Submit Event
            </Link>
            <Link
              href="/my-submissions"
              className="hover:text-primary transition-colors duration-300 ease-in-out"
            >
              Track Submissions
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors duration-300 ease-in-out"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors duration-300 ease-in-out"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors duration-300 ease-in-out"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-use"
              className="hover:text-primary transition-colors duration-300 ease-in-out"
            >
              Terms
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-xs">
          © {new Date().getFullYear()} LinkUp. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
