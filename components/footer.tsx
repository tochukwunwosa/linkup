// import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between lg:items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="w-6 font-bold text-primary">
              <span>LinkUp</span>
              {/* <Image src={'/assets/logo/linkup-logo-80x35.svg'} width={177} height={72} alt='LinkUp logo.' className='w-32'/> */}
            </Link>
            <p className="text-muted-foreground text-xs md:sm mt-px">Discover tech events near you</p>
          </div>
          <nav className="flex space-x-6 text-md">
            <Link href="#about" className="text-muted-forground hover:text-primary">
              About
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-primary">
              Contact
            </Link>
            <Link href="#privacy" className="text-muted-foreground hover:text-primary">
              Privacy
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-muted text-center text-muted-foreground text-xs">
          © {new Date().getFullYear()} LinkUp. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
