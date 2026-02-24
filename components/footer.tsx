'use client'

import Link from 'next/link'
import React from 'react'

const topLocations = [
  { slug: 'lagos', label: 'Lagos' },
  { slug: 'abuja', label: 'Abuja' },
  { slug: 'rivers', label: 'Rivers (Port Harcourt)' },
  { slug: 'enugu', label: 'Enugu' },
  { slug: 'kano', label: 'Kano' },
  { slug: 'oyo', label: 'Oyo (Ibadan)' },
  { slug: 'anambra', label: 'Anambra' },
  { slug: 'edo', label: 'Edo (Benin City)' },
]

const topCategories = [
  { slug: 'web3', label: 'Web3 & Blockchain' },
  { slug: 'ai-ml', label: 'AI & Machine Learning' },
  { slug: 'hackathon', label: 'Hackathons' },
  { slug: 'fintech', label: 'Fintech' },
  { slug: 'startup', label: 'Startup & Entrepreneurship' },
  { slug: 'data-science', label: 'Data Science' },
  { slug: 'cybersecurity', label: 'Cybersecurity' },
  { slug: 'design-ux', label: 'Design & UX' },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-gray-900 text-lg">
              TechLinkUp
            </Link>
            <p className="text-muted-foreground text-xs mt-2 leading-relaxed max-w-[180px]">
              Community-driven tech event discovery across Nigeria.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/submit-event" className="hover:text-primary transition-colors">Submit Event</Link></li>
              <li><Link href="/my-submissions" className="hover:text-primary transition-colors">Track Submissions</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Events by State
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {topLocations.map((l) => (
                <li key={l.slug}>
                  <Link href={`/location/${l.slug}`} className="hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" className="hover:text-primary transition-colors text-xs">
                  All states →
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Events by Category
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {topCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="hover:text-primary transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} TechLinkUp. All rights reserved.</span>
          <span>Built for Nigeria&apos;s tech community.</span>
        </div>
      </div>
    </footer>
  )
}
