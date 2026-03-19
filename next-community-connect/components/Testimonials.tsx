'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimate } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const testimonials = [
  {
    quote: "Through Community Connect, I found amazing volunteer tutors who helped my daughter excel in math. What started as weekly sessions turned into a lasting mentorship that changed her academic trajectory.",
    author: 'Maria Rodriguez',
    role: 'Parent, Eastside Neighborhood',
    initials: 'MR',
  },
  {
    quote: "I wanted to give back but didn't know where to start. Community Connect matched me with our local food bank, and now I volunteer every weekend. It's become one of the most rewarding parts of my life.",
    author: 'James Chen',
    role: 'Volunteer, 2 years',
    initials: 'JC',
  },
  {
    quote: "We used Community Connect to organize a neighborhood cleanup and over 50 volunteers showed up. What was a neglected park is now a beautiful space where families gather every weekend.",
    author: 'Riverside Neighbors',
    role: 'Community Group',
    initials: 'RN',
  },
]

function TestimonialCard({ testimonial, direction }: { testimonial: typeof testimonials[0]; direction: number }) {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(scope.current, { 
      x: direction > 0 ? 400 : -400, 
      opacity: 0 
    }, { duration: 0.3 }).then(() => {
      animate(scope.current, { 
        x: direction < 0 ? 400 : -400, 
        opacity: 0 
      }, { duration: 0 })
      animate(scope.current, { 
        x: 0, 
        opacity: 1 
      }, { duration: 0.4 })
    })
  }, [testimonial, direction, animate, scope])

  return (
    <div ref={scope} className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-bg-md rounded-2xl p-8 md:p-12 border border-sky-200 backdrop-blur-lg shadow-glass"
      >
        <span className="text-5xl text-sky-200 leading-none font-serif block mb-3">&ldquo;</span>
        <div className="text-accent-warm text-sm mb-4 tracking-widest">★★★★★</div>
        <p className="testimonial-text mb-8 text-lg md:text-xl text-sky-900">{testimonial.quote}</p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white font-syne font-bold text-lg shadow-md">
            {testimonial.initials}
          </div>
          <div>
            <div className="font-syne font-semibold text-lg text-sky-900">{testimonial.author}</div>
            <div className="font-dm-sans text-sm text-sky-600">{testimonial.role}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1)
  }

  const handleNext = () => {
    setDirection(1)
    setActiveIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(interval)
  }, [activeIndex])

  return (
    <section className="py-24 glass-bg backdrop-blur" id="stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-eyebrow">Community Stories</span>
          <h2 className="section-heading">Hear from the people we've helped.</h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 w-12 h-12 rounded-full glass-bg-md border border-sky-200 flex items-center justify-center text-sky-700 hover:bg-sky-400 hover:text-white transition-all shadow-glass hover:shadow-sky-500/20"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft size={24} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 w-12 h-12 rounded-full glass-bg-md border border-sky-200 flex items-center justify-center text-sky-700 hover:bg-sky-400 hover:text-white transition-all shadow-glass hover:shadow-sky-500/20"
            aria-label="Next testimonial"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Testimonial Content */}
          <div className="overflow-hidden px-8">
            <TestimonialCard 
              testimonial={testimonials[activeIndex]} 
              direction={direction} 
            />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > activeIndex ? 1 : -1)
                  setActiveIndex(i)
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeIndex 
                    ? 'bg-sky-500 w-8' 
                    : 'bg-sky-200 hover:bg-sky-400'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

