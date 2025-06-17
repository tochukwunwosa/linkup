import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="w-6 font-bold text-indigo-600">
              <Image src={'/assets/logo/LinkUp-Logo-80x35-removebg-preview.png'} width={177} height={72} alt='LinkUp logo.' className='w-32'/>
            </Link>
            <p className="text-gray-600 mt-px">Discover tech events near you</p>
          </div>
          <nav className="flex space-x-6">
            <Link href="#about" className="text-gray-600 hover:text-indigo-600">
              About
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-indigo-600">
              Contact
            </Link>
            <Link href="#privacy" className="text-gray-600 hover:text-indigo-600">
              Privacy
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} LinkUp. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
