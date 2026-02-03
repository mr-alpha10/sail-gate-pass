"use client"

import RegisterForm from "./register-form"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Search, User } from "lucide-react"

export default function RegisterPageClient() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="https://v0-new-project-8ufbparruyg-aps-projects-3bc236cf.vercel.app/sail-diamond-logo.png"
              alt="SAIL Logo with Great Place To Work Certification"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <div className="text-sm">
              <p>This is the official website of Steel Authority of India Limited (SAIL),</p>
              <p>a Public Sector Undertaking under the Ministry of Steel, Government of India</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm mb-1">
              <span>Skip to main content</span>
              <Link href="#" className="text-blue-500 ml-4">
                English
              </Link>
              <Link href="#" className="text-blue-500 ml-2">
                Hindi
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-[#0a3170] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Input type="search" placeholder="search" className="pl-10 pr-4 py-1 rounded-md w-48" />
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center">
              <Link href="#" className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
                <User size={20} className="text-white" />
                <span className="text-sm font-medium">My Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-medium tracking-wider">STEEL AUTHORITY OF INDIA LIMITED</h1>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideUpLogo {
          0% {
            transform: translate(-50%, 100%) translateY(200px);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
        
        @keyframes slideUpText {
          0% {
            transform: translate(-50%, 0) translateY(150px);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        
        .animate-slide-up-logo {
          animation: slideUpLogo 1.2s ease-out forwards;
        }
        
        .animate-slide-up-text {
          animation: slideUpText 1.4s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Unified Glass Container */}
            <div className="backdrop-blur-lg bg-white/20 rounded-3xl border border-white/30 shadow-2xl overflow-hidden relative">
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

              <div className="flex flex-col md:flex-row relative z-10">
                {/* Left Side - Gate Pass */}
                <div className="md:w-1/2 p-8">
                  <div className="relative h-full">
                    <div className="bg-gradient-to-br from-blue-500 via-[#1e40af] to-[#0a2472] h-full rounded-xl overflow-hidden relative min-h-[400px] shadow-xl">
                      {/* Header Text */}
                      <div className="absolute top-4 left-0 right-0 text-center">
                        <div className="text-white text-xs font-semibold tracking-wide">
                          STEEL AUTHORITY OF INDIA LIMITED
                        </div>
                      </div>

                      {/* Diamond Logo */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-slide-up-logo">
                        <Link
                          href="https://www.sail.co.in/en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                          <div className="bg-white p-6 rounded-lg rotate-45 relative w-32 h-32 flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <div className="rotate-[-45deg]">
                              <Image
                                src="https://v0-new-project-8ufbparruyg-aps-projects-3bc236cf.vercel.app/sail-diamond-logo.png"
                                alt="SAIL Logo - Click to visit SAIL website"
                                width={70}
                                height={70}
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Gate Pass Text with Enhanced Styling */}
                      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center animate-slide-up-text">
                        <h2 className="text-yellow-300 text-3xl font-bold mb-3 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] whitespace-nowrap">
                          SAIL RANCHI
                        </h2>
                        <div className="relative">
                          <div className="absolute -inset-2 bg-blue-900 opacity-50 rounded-lg blur-sm"></div>
                          <p className="text-white text-xl font-medium relative z-10 px-6 py-1 border-t border-b border-white/30">
                            Gate Pass System
                          </p>
                        </div>
                      </div>

                      {/* Decorative Corner Elements */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white/30 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white/30 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white/30 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white/30 rounded-br-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent my-8"></div>

                {/* Right Side - Registration Form */}
                <div className="md:w-1/2 p-8">
                  <div className="h-full flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Create an account</h2>
                    <p className="mb-6 text-gray-600">Enter your details below</p>
                    <RegisterForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a1e42] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Support */}
            <div>
              <h3 className="text-xl font-medium mb-4">Support</h3>
              <address className="not-italic">
                <p>ISPAT BHAWAN, H-</p>
                <p>Block, Shyamali</p>
                <p>Colony, Doranda,</p>
                <p>Ranchi, Jharkhand</p>
                <p>834002</p>
                <p className="mt-4">0651 241 1106</p>
              </address>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xl font-medium mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:underline">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Link */}
            <div>
              <h3 className="text-xl font-medium mb-4">Quick Link</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Terms Of Use
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-6 mt-12">
            <Link href="#" className="hover:text-gray-300">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <Linkedin size={20} />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400 mt-12">© Copyright 2024. All right reserved</div>
        </div>
      </footer>
    </div>
  )
}
