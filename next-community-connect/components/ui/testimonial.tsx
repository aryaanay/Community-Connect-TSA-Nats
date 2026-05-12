'use client'

import * as React from "react"
import { motion, PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: number | string
  name: string
  avatar?: string
  avatarColor?: string
  description: string
  role?: string
}

interface TestimonialCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[]
  showArrows?: boolean
  showDots?: boolean
}

const TestimonialCarousel = React.forwardRef<
  HTMLDivElement,
  TestimonialCarouselProps
>(
  (
    { className, testimonials, showArrows = true, showDots = true, ...props },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [exitX, setExitX] = React.useState<number>(0)

    const handleDragEnd = (
      event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      if (Math.abs(info.offset.x) > 80) {
        setExitX(info.offset.x)
        setTimeout(() => {
          if (info.offset.x < 0) {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
          } else {
            setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
          }
          setExitX(0)
        }, 200)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-[420px] w-full flex items-center justify-center py-2",
          className
        )}
        {...props}
      >
        <div className="relative" style={{ width: 'min(92vw, 680px)', height: '380px' }}>
          {testimonials.map((testimonial, index) => {
            const offset = (index - currentIndex + testimonials.length) % testimonials.length
            const isCurrentCard = offset === 0
            const isPrevCard = offset === 1
            const isNextCard = offset === 2

            if (!isCurrentCard && !isPrevCard && !isNextCard) return null

            return (
              <motion.div
                key={testimonial.id}
                className={cn(
                  "testimonial-card absolute w-full h-full rounded-3xl cursor-grab active:cursor-grabbing",
                  "bg-white shadow-2xl border border-sky-100",
                )}
                style={{
                  zIndex: isCurrentCard ? 3 : isPrevCard ? 2 : 1,
                }}
                drag={isCurrentCard ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={isCurrentCard ? handleDragEnd : undefined}
                initial={{
                  scale: 0.95,
                  opacity: 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 10 : 20,
                  rotate: isCurrentCard ? 0 : isPrevCard ? -2 : -4,
                }}
                animate={{
                  scale: isCurrentCard ? 1 : isPrevCard ? 0.95 : 0.9,
                  opacity: isCurrentCard ? 1 : isPrevCard ? 0.55 : 0.28,
                  x: isCurrentCard ? exitX : 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 10 : 20,
                  rotate: isCurrentCard ? exitX / 22 : isPrevCard ? -2 : -4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 22,
                }}
              >
                {showArrows && isCurrentCard && (
                  <div className="absolute inset-x-0 top-3 flex justify-between px-5">
                    <span className="text-xl select-none text-sky-200">←</span>
                    <span className="text-xl select-none text-sky-200">→</span>
                  </div>
                )}

                <div className="p-10 flex flex-col items-center gap-5 h-full justify-center">
                  {testimonial.avatarColor ? (
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                      style={{ background: testimonial.avatarColor }}
                    >
                      <span className="font-syne text-3xl font-bold text-white">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-sky-100"
                    />
                  )}
                  <div className="text-center">
                    <h3 className="testimonial-name font-syne text-lg font-bold text-sky-950 mb-0.5">
                      {testimonial.name}
                    </h3>
                    {testimonial.role && (
                      <p className="testimonial-role font-outfit text-sm text-sky-500 mb-3">{testimonial.role}</p>
                    )}
                    {!testimonial.role && <div className="mb-3" />}
                  </div>
                  <p className="testimonial-desc text-center font-dm-sans text-base leading-relaxed text-sky-700 max-w-[520px]">
                    {testimonial.description}
                  </p>
                  <span className="font-space text-sm font-bold text-amber-400 mt-1">★★★★★</span>
                </div>
              </motion.div>
            )
          })}

          {showDots && (
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-sky-400 shadow-[0_0_10px_rgba(86,187,240,0.7)] scale-110"
                      : "bg-sky-200 hover:bg-sky-300",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
)
TestimonialCarousel.displayName = "TestimonialCarousel"

export { TestimonialCarousel, type Testimonial }
