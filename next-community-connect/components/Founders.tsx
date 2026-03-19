'use client';

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const founders: Testimonial[] = [
  {
    quote: "Our founding team came together with one shared belief: every resident deserves easy access to the resources around them. We built this platform to bridge the gap between community members and the services they need.",
    name: "Alex Chen*",
    designation: "Co-Founder & Executive Director",
    src: "AC",
  },
  {
    quote: "As a software engineer turned civic tech advocate, I'm passionate about making public services more accessible. Technology should empower communities, not complicate them.",
    name: "Jordan Kim*",
    designation: "Co-Founder & Tech Lead",
    src: "JK",
  },
  {
    quote: "With experience growing our network to 48 organizations and counting, I believe in the power of partnerships to amplify our impact and reach more people who need our help.",
    name: "Priya Patel*",
    designation: "Director of Partnerships",
    src: "PP",
  },
  {
    quote: "As a youth advocate and former city council aide, I know that grassroots solutions are the most effective. This platform was built from the community, for the community.",
    name: "Marcus Thompson*",
    designation: "Community Outreach Lead",
    src: "MT",
  },
];

export function Founders() {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % founders.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + founders.length) % founders.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }, []);

const getRotate = (index: number): number => {
    return index * 3 - 6; // Deterministic: -6, -3, 0, 3 deg
  };

  return (
    <section className="py-24 glass-bg-md backdrop-blur" id="team">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14 px-4"
      >
        <span className="section-eyebrow">Our Founders</span>
        <h2 className="section-heading">Built by community members, for the community.</h2>
        <p className="section-subtext mx-auto">Meet the team behind Community Connect.</p>
      </motion.div>

      <div className={cn("max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12")}>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <div className="relative h-80 w-full">
              <AnimatePresence>
                {founders.map((founder, index) => (
                  <motion.div
                    key={founder.src}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: getRotate(index),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : getRotate(index),
                      zIndex: isActive(index)
                        ? 999
                        : founders.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: getRotate(index),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <div
                      className="h-full w-full rounded-3xl object-cover object-center flex items-center justify-center bg-gradient-to-br from-sky-700 to-sky-500 text-white font-syne font-bold text-4xl border-4 border-sky-200 shadow-glass-lg"
                    >
                      {founder.src}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex justify-between flex-col py-4">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 className="text-2xl font-bold text-sky-900">
                {founders[active].name}
              </h3>
              <p className="text-sm text-sky-500 font-medium">
                {founders[active].designation}
              </p>
              <motion.p className="text-lg text-sky-700 mt-8 leading-relaxed">
                {founders[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
            <div className="flex gap-4 pt-12 md:pt-0">
              <button
                onClick={handlePrev}
                className="h-10 w-10 rounded-full bg-sky-200 flex items-center justify-center group/button hover:bg-sky-400 transition-colors duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-sky-800 group-hover/button:rotate-12 transition-transform duration-300" />
              </button>
              <button
                onClick={handleNext}
                className="h-10 w-10 rounded-full bg-sky-200 flex items-center justify-center group/button hover:bg-sky-400 transition-colors duration-300"
              >
                <ArrowRight className="h-5 w-5 text-sky-800 group-hover/button:-rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center font-dm-sans text-xs text-sky-400 mt-10 px-4">
        *Names are fictional and used for competition purposes only. Any resemblance to real persons is coincidental.
      </p>
    </section>
  );
}

