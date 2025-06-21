import { Calendar, Sparkles, ArrowRight } from "lucide-react"
import BackgroundSlideButton from "@/components/background-slide-button"
import { cn } from "@/lib/utils"

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/images/wceu.jpeg')`,
        }}
      />

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/80 to-blue-900/70" />

      {/* Animated Background Elements - More Subtle */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-pulse"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-2 h-2 bg-secondary/30 rounded-full animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-primary/35 rounded-full animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-secondary/25 rounded-full animate-pulse"
          style={{ animationDelay: "2.5s", animationDuration: "4.5s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          {/* Badge with better spacing */}
          <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-full px-6 py-3 mb-12 text-primary-foreground text-sm font-medium shadow-lg">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-white/90">Discover Amazing Tech Events</span>
          </div>

          {/* Main Heading with improved spacing */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-5xl lg:text-7xl font-bold leading-none tracking-tight">
              <span className="block mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                Connect. Learn.
              </span>
              <span className="block bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                Innovate.
              </span>
            </h1>
          </div>

          {/* Subtitle with better contrast and spacing */}
          <div className="mb-10">
            <p className="text-md text-slate-200 max-w-5xl mx-auto leading-relaxed font-light">
              Discover curated tech events, hackathons, and meetups in your area.
              <br className="hidden md:block" />
              <span className="text-slate-300">Connect with like-minded innovators and expand your horizons.</span>
            </p>
          </div>



          {/* CTA Buttons with improved spacing */}
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
              <BackgroundSlideButton onClick={() => { document.getElementById("filters")?.scrollIntoView({ behavior: "smooth" }) }} className={cn("shadow-xl hover:shadow-2xl w-fit px-4 max-w-56 h-14 text-background font-semibold text-lg  border border-background")}>
                <span className="flex items-center gap-3 text-md">
                  <Calendar className="w-5 h-5" />
                  Find Events
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </BackgroundSlideButton>

              {/* <button className="w-full sm:w-56 h-16 bg-transparent hover:bg-white/10 rounded-xl flex items-center justify-center cursor-pointer text-white font-semibold text-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
                <span className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Host an Event
                </span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
