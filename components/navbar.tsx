import React from 'react'
import Link from 'next/link'
// import Image from 'next/image'

export default function Navbar() {
  return (
    <header className="bg-white border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="w-24 font-bold text-primary">
              {/* <Image src={'/assets/logo/linkup-logo-80x35.svg'} width={177} height={72} alt='LinkUp logo.' priority/> */}
              <span>LinkUp</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#events" className="hover:text-primary font-medium  transition-colors duration-300 ease-in-out">
              Events
            </Link>
            {/* <Link href="#submit" className="hover:text-primary font-medium">
              Submit
            </Link> */}
            <Link href="/" className="hover:text-primary font-medium  transition-colors duration-300 ease-in-out">
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
