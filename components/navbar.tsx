import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="w-24">
              <Image src={'/assets/logo/linkup-Logo-80x35-removebg-preview.png'} width={177} height={72} alt='LinkUp logo.' priority/>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#events" className="hover:text-primary font-medium">
              Events
            </Link>
            {/* <Link href="#submit" className="hover:text-primary font-medium">
              Submit
            </Link> */}
            <Link href="/" className="hover:text-primary font-medium">
              About
            </Link>
          </nav>
          {/* <BackgroundSlideButton onClick={() => { window.location.href = "/login" }} className={cn("shadow-none w-fit px-4 border h-10 bg-background rounded-md flex items-center justify-center cursor-pointer text-primary")}>
            Login
          </BackgroundSlideButton> */}
        </div>
      </div>
    </header>
  )
}
