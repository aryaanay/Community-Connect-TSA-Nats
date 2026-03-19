'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-24 border-t border-sky-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-sky-700 via-sky-600 to-sky-500 rounded-3xl p-16 text-center relative overflow-hidden glass-bg-md backdrop-blur-lg shadow-glass-lg"
        >
          {/* Background pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(36,153,214,0.2)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(236,248,255,0.1)_0%,transparent_50%)]" />
          </div>

          <div className="relative z-10">
            <h2 className="font-syne text-4xl font-bold text-white mb-4">Ready to connect with your community?</h2>
            <p className="font-dm-sans text-lg text-white/90 max-w-lg mx-auto mb-8 font-light">
              Whether you are looking for help, want to give back, or know of a resource others should know about, start here.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/resources" className="bg-white text-sky-800 px-6 py-3 rounded-2xl font-dm-sans font-semibold flex items-center gap-2 shadow-2xl hover:shadow-sky-500/30 hover:-translate-y-1 transition-all">
                <span>Find Resources</span>
              </Link>
              <Link href="/submit" className="glass-bg-md border border-white/30 text-white px-6 py-3 rounded-2xl font-dm-sans font-semibold flex items-center gap-2 backdrop-blur hover:bg-white/20 hover:border-white/50 transition-all">
                <span>Submit a Resource</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

