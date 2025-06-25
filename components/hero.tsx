"use client"

import { Calendar, Sparkles, ArrowRight } from "lucide-react"
import BackgroundSlideButton from "@/components/background-slide-button"
import { cn } from "@/lib/utils"

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] md:min-h-screen overflow-hidden">
      {/* Background Image with subtle zoom animation */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-[breathe_20s_ease-in-out_infinite]"
        style={{
          backgroundImage: `url('/assets/images/wceu.jpeg')`,
        }}
      />

      {/* Gradient Overlay with subtle shift */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/80 to-blue-900/70 animate-[gradientShift_15s_ease-in-out_infinite]" />

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles with different speeds and paths */}
        <div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-3 h-3 bg-primary/40 rounded-full animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/2 right-3/2 w-3 h-3 bg-primary/40 rounded-full animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/2 left-3/2 w-3 h-3 bg-primary/40 rounded-full animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-2 h-2 bg-secondary/30 rounded-full animate-[floatReverse_8s_ease-in-out_infinite]"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-primary/35 rounded-full animate-[float_7s_ease-in-out_infinite]"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-secondary/25 rounded-full animate-[floatReverse_9s_ease-in-out_infinite]"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute top-2/3 left-1/6 w-2 h-2 bg-primary/20 rounded-full animate-[float_5s_ease-in-out_infinite]"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/6 right-2/3 w-1 h-1 bg-secondary/40 rounded-full animate-[floatReverse_6s_ease-in-out_infinite]"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Content with staggered animations */}
      <div className="relative z-10 flex items-center justify-center py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          {/* Badge with entrance animation */}
          <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-full px-6 py-3 mb-12 text-primary-foreground text-sm font-medium shadow-lg animate-[slideInDown_1s_ease-out_0.2s_both] hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-primary animate-[sparkle_2s_ease-in-out_infinite]" />
            <span className="text-white/90">Discover Amazing Tech Events</span>
          </div>

          {/* Main Heading with staggered entrance */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-none tracking-tight">
              <span className="block mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent animate-[slideInLeft_1s_ease-out_0.4s_both]">
                Connect. Learn.
              </span>
              <span className="block bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent animate-[slideInRight_1s_ease-out_0.6s_both]">
                Innovate.
              </span>
            </h1>
          </div>

          {/* Subtitle with fade in */}
          <div className="mb-10 animate-[fadeInUp_1s_ease-out_0.8s_both]">
            <p className="text-md text-slate-200 max-w-5xl mx-auto leading-relaxed font-light">
              Discover curated tech events, hackathons, and meetups in your area.
              <br className="hidden md:block" />
              <span className="text-slate-300">Connect with like-minded innovators and expand your horizons.</span>
            </p>
          </div>

          {/* CTA Button with entrance animation */}
          <div className="mb-20 animate-[fadeInUp_1s_ease-out_1s_both]">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
              <BackgroundSlideButton
                onClick={() => {
                  document.getElementById("filters")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={cn(
                  "shadow-xl hover:shadow-2xl w-fit px-4 max-w-56 h-14 font-semibold text-lg text-background border border-primary hover:scale-105 transition-all duration-300",
                )}
              >
                <span className="flex items-center gap-3 text-md">
                  <Calendar className="w-5 h-5 animate-[bounce_2s_ease-in-out_infinite_2s]" />
                  Find Events
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform animate-[slideRight_2s_ease-in-out_infinite_1s]" />
                </span>
              </BackgroundSlideButton>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; }
          50% { transform: translateY(-5px) translateX(-3px); opacity: 0.8; }
          75% { transform: translateY(-15px) translateX(8px); opacity: 0.5; }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(10px) translateX(-5px); opacity: 0.7; }
          50% { transform: translateY(5px) translateX(3px); opacity: 0.9; }
          75% { transform: translateY(15px) translateX(-8px); opacity: 0.4; }
        }
        
        @keyframes slideInDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.1); }
        }
        
        @keyframes slideRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
      `}</style>
    </section>
  )
}
