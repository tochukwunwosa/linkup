import Link from 'next/link'
import Image from 'next/image'
import { Twitter, Linkedin, Instagram } from 'lucide-react'

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
    <footer className="bg-[#0d0e12] border-t-2 border-[#c9f72f] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Go to homepage" className="inline-flex items-center gap-2 mb-3">
              <Image
                src="/logo.svg"
                alt="TechLinkUp"
                width={28}
                height={28}
                className="brightness-0 invert opacity-90"
              />
              <span className="font-bold text-white text-lg">TechLinkUp</span>
            </Link>
            <p className="text-white/55 text-xs leading-relaxed max-w-[180px] mb-4">
              Community-driven tech event discovery across Nigeria.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter / X" className="text-white/40 hover:text-white/80 transition-colors duration-200">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white/40 hover:text-white/80 transition-colors duration-200">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/40 hover:text-white/80 transition-colors duration-200">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-[#c9f72f] text-xs font-semibold uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit-event" className="text-white/55 hover:text-white transition-colors duration-200">Submit Event</Link></li>
              <li><Link href="/my-submissions" className="text-white/55 hover:text-white transition-colors duration-200">Track Submissions</Link></li>
              <li><Link href="/about" className="text-white/55 hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link href="/contact" className="text-white/55 hover:text-white transition-colors duration-200">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-white/55 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use" className="text-white/55 hover:text-white transition-colors duration-200">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-[#c9f72f] text-xs font-semibold uppercase tracking-wider mb-3">
              Events by State
            </h3>
            <ul className="space-y-2 text-sm">
              {topLocations.map((l) => (
                <li key={l.slug}>
                  <Link href={`/location/${l.slug}`} className="text-white/55 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" className="text-white/55 hover:text-white transition-colors duration-200 text-xs">
                  All states →
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[#c9f72f] text-xs font-semibold uppercase tracking-wider mb-3">
              Events by Category
            </h3>
            <ul className="space-y-2 text-sm">
              {topCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-white/55 hover:text-white transition-colors duration-200">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/35">
          <span>© {new Date().getFullYear()} TechLinkUp. All rights reserved.</span>
          <span>Built for Nigeria&apos;s tech community.</span>
        </div>
      </div>
    </footer>
  )
}
