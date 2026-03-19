'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Handshake, GraduationCap, Heart, Leaf, UtensilsCrossed } from 'lucide-react'
import React from 'react'

const footerLinks = {
  explore: [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Upcoming Events' },
    { href: '/resources', label: 'Resource Hub' },
    { href: '/submit', label: 'Submit a Resource' },
    { href: '/about', label: 'About Us' },
    { href: '/copyright', label: 'Copyright & References' },
  ],
  categories: [
    { href: '/resources?cat=Education', label: 'Education' },
    { href: '/resources?cat=Health', label: 'Health & Wellness' },
    { href: '/resources?cat=Career', label: 'Career & Jobs' },
    { href: '/resources?cat=Volunteering', label: 'Volunteering' },
    { href: '/resources?cat=Community Projects', label: 'Community Projects' },
  ],
}

const socialIcons = [
  { name: 'Facebook', icon: 'f' },
  { name: 'Instagram', icon: 'ig' },
  { name: 'Twitter', icon: 'X' },
  { name: 'LinkedIn', icon: 'in' },
]

const partners: { icon: React.ElementType; label: string }[] = [
  { icon: Handshake, label: 'United Way' },
  { icon: GraduationCap, label: 'Local Schools' },
  { icon: Heart, label: 'Health District' },
  { icon: Leaf, label: 'Parks Dept.' },
  { icon: UtensilsCrossed, label: 'Food Bank' },
]

export function Footer() {
  return (
    <footer
      className="relative text-white/85 transition-colors duration-500"
      style={{ background: 'linear-gradient(160deg, #011629 0%, #022747 50%, #033460 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-sky-400/20">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="14" cy="14" r="12.5" stroke="#56BBF0" strokeWidth="1.5"/>
                <circle cx="14" cy="14" r="3" fill="#56BBF0"/>
                <circle cx="14" cy="5.5" r="2" fill="#90D4F7"/>
                <circle cx="21.5" cy="18.5" r="2" fill="#90D4F7"/>
                <circle cx="6.5" cy="18.5" r="2" fill="#90D4F7"/>
                <line x1="14" y1="11" x2="14" y2="7.5" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="16.5" y1="15.5" x2="19.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="11.5" y1="15.5" x2="8.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="font-syne text-base font-light text-white">
                Community<strong className="font-bold">Connect</strong>
              </span>
            </Link>
            <p className="font-dm-sans text-sm leading-relaxed mb-5 max-w-[280px]" style={{ color: 'rgba(198,235,255,0.85)' }}>
              Building stronger communities through collaboration, service, and shared resources.
            </p>
            <div className="flex gap-2.5">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full border border-sky-400/30 flex items-center justify-center text-xs font-bold hover:bg-sky-500 hover:border-sky-400 hover:text-white transition-all hover:-translate-y-0.5 backdrop-blur-sm"
                  style={{ backgroundColor: 'rgba(36,153,214,0.15)', color: 'rgba(198,235,255,0.8)' }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-syne text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#90D4F7' }}>Explore</h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-dm-sans text-sm flex items-center gap-2 group hover:text-white transition-colors"
                    style={{ color: 'rgba(198,235,255,0.8)' }}
                  >
                    <span className="text-[9px] text-sky-400 group-hover:translate-x-1 transition-transform">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-syne text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#90D4F7' }}>Categories</h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-dm-sans text-sm flex items-center gap-2 group hover:text-white transition-colors"
                    style={{ color: 'rgba(198,235,255,0.8)' }}
                  >
                    <span className="text-[9px] text-sky-400 group-hover:translate-x-1 transition-transform">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-syne text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#90D4F7' }}>Contact Us</h4>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', content: 'communityconnect@gmail.com', href: 'mailto:communityconnect@gmail.com' },
                { icon: Phone, label: 'Phone', content: '(123) 456-7890', href: 'tel:+11234567890' },
                { icon: MapPin, label: 'Location', content: 'Bothell, Washington 98011', href: 'https://www.google.com/maps/search/?api=1&query=Bothell+Washington+98011' },
                { icon: Clock, label: 'Hours', content: 'Mon-Fri, 9am - 5pm', href: undefined },
              ].map(({ icon: Icon, label, content, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(36,153,214,0.2)', border: '1px solid rgba(86,187,240,0.4)' }}>
                    <Icon size={14} className="text-sky-300" />
                  </div>
                  <div>
                    <p className="font-dm-sans text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#90D4F7' }}>{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="font-dm-sans text-sm hover:text-white transition-colors" style={{ color: 'rgba(198,235,255,0.9)' }}>
                        {content}
                      </a>
                    ) : (
                      <span className="font-dm-sans text-sm" style={{ color: 'rgba(198,235,255,0.9)' }}>{content}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="py-6 border-b flex flex-col items-center gap-4" style={{ borderColor: 'rgba(86,187,240,0.15)' }}>
          <span className="font-syne text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(144,212,247,0.6)' }}>
            Trusted Community Partners
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {partners.map((partner, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-full px-3.5 py-1.5 flex items-center gap-1.5 cursor-default backdrop-blur-sm hover:-translate-y-0.5 transition-transform"
                style={{ border: '1px solid rgba(86,187,240,0.2)', backgroundColor: 'rgba(36,153,214,0.1)', fontFamily: 'var(--font-space)', fontSize: '12px', color: 'rgba(198,235,255,0.9)' }}
              >
                <partner.icon size={12} className="text-sky-300" />
                {partner.label}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-dm-sans text-sm" style={{ color: 'rgba(144,212,247,0.7)' }}>
            © 2025 CommunityConnect | Bothell, WA
          </p>
          <div className="flex items-center gap-4">
            <Link href="/copyright" className="font-dm-sans text-xs hover:text-white transition-colors" style={{ color: 'rgba(198,235,255,0.75)' }}>
              Copyright
            </Link>
            <span style={{ color: 'rgba(86,187,240,0.3)' }}>|</span>
            <Link href="/settings" className="font-dm-sans text-xs hover:text-white transition-colors" style={{ color: 'rgba(198,235,255,0.75)' }}>
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
