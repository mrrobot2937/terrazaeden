'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ArrowRight, MessageCircle, Ticket } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import brandsData from '@/data/brands.json'
import { Brand } from '@/types/brand'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 100
    }
  }
}

// Pre-generate particle positions to avoid hydration mismatch
const generateParticles = () => {
  const particles = []
  for (let i = 0; i < 15; i++) {
    particles.push({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4
    })
  }
  return particles
}

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [particles] = useState(generateParticles)
  const brands: Brand[] = brandsData.brands
  const terrazaWhatsappNumber: string = (process.env.NEXT_PUBLIC_WHATSAPP_TERRAZA as string) || '+573113592535'

  useEffect(() => {
    setMounted(true)
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 768)
    updateIsDesktop()
    window.addEventListener('resize', updateIsDesktop)
    
    let raf = 0
    const handleMouseMove = (e: MouseEvent) => {
      if (raf) cancelAnimationFrame(raf)
      const { clientX, clientY } = e
      raf = requestAnimationFrame(() => setMousePosition({ x: clientX, y: clientY }))
    }

    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateIsDesktop)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements - Desktop only to optimize mobile */}
      {mounted && isDesktop && (
        <div className="absolute inset-0">
          <div 
            className="absolute w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-10 transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
          <div 
            className="absolute top-1/2 right-0 w-80 h-80 bg-yellow-400 rounded-full filter blur-3xl opacity-8 transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
            }}
          />
          <div 
            className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500 rounded-full filter blur-3xl opacity-6 transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
            }}
          />
        </div>
      )}

      {/* Floating particles - Desktop only to optimize mobile */}
      {mounted && isDesktop && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30"
              animate={{
                y: [-10, 10, -10],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: particle.delay
                }
              }}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        {/* Header with Logo and scroll indicator */}
        <motion.header 
          className="min-h-screen flex flex-col justify-center items-center relative z-10 py-8 sm:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* WhatsApp shortcut */}
          <a
            href={`https://wa.me/${terrazaWhatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Terraza Eden"
            className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-400 text-black font-semibold shadow-lg border border-green-300 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          {/* Logo Principal */}
          <motion.div
            className="flex justify-center mb-8 sm:mb-12 md:mb-16 w-full px-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring" as const, delay: 0.5 }}
          >
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl aspect-square">
              <Image
                src="/logos/terrazaeden.png"
                alt="Terraza Eden"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 60vw, (max-width: 1024px) 50vw, (max-width: 1280px) 40vw, 35vw"
                priority
              />
            </div>
          </motion.div>

          {/* CTA: Rifas y Bonos */}
          <Link href="/rifas" className="w-full px-4">
            <Card className="group relative mx-auto max-w-2xl overflow-hidden cursor-pointer border border-yellow-500/30 bg-gray-900/60 backdrop-blur hover:bg-gray-800/70 hover:border-yellow-500/60 transition-all duration-500">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl" style={{ backgroundColor: '#F59E0B' }} />
              <div className="relative z-10 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-500 text-black shadow-lg">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">Participa por Bonos</h2>
                  <p className="text-gray-300 text-sm sm:text-base">Inscríbete en nuestras rifas activas con tu usuario de Instagram.</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Scroll Down Indicator */}
          <motion.div
            className="flex flex-col items-center space-y-3 sm:space-y-4 cursor-pointer px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            onClick={() => {
              document.getElementById('brands-section')?.scrollIntoView({ 
                behavior: 'smooth' 
              })
            }}
          >
            <div className="text-white text-center hover:text-yellow-400 transition-colors duration-300">
              <p className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Desliza para explorar nuestras marcas</p>
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-yellow-400 rounded-full flex justify-center hover:border-yellow-300 transition-colors duration-300"
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                    className="w-1 h-2.5 sm:h-3 bg-yellow-400 rounded-full mt-1.5 sm:mt-2"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Brands Grid - Mobile: compact logo-only tiles */}
        <motion.section
          id="brands-section"
          className="container mx-auto px-3 pb-16 pt-10 md:hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-4 gap-3">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.id}`} className="group">
                  <div
                    className="relative rounded-xl border border-gray-800 bg-gray-900/60 p-2 overflow-hidden"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
                         style={{ backgroundColor: brand.primaryColor }}
                    />
                    <div className="relative w-full h-full">
                      <Image
                        src={brand.logo}
                        alt={`Logo de ${brand.name}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 22vw, 160px"
                      />
                    </div>
                  </div>
                  <span className="sr-only">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Brands Grid - Desktop: rich cards */}
        <motion.main 
          className="container mx-auto px-6 pb-20 pt-16 hidden md:block"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={`/brands/${brand.id}`}>
                  <Card className="group relative overflow-hidden h-96 cursor-pointer border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-yellow-500/50 transition-all duration-500">
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: brand.primaryColor }}
                    />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                      style={{ backgroundColor: brand.primaryColor }}
                    />

                    <div className="relative z-10 p-6 h-full flex flex-col">
                      <div className="flex-shrink-0 flex items-center justify-center mb-6 h-28">
                        <div
                          className="w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden"
                          style={{
                            border: `2px solid ${brand.primaryColor}40`,
                            boxShadow: `0 8px 30px ${brand.primaryColor}20`
                          }}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={brand.logo}
                              alt={`Logo de ${brand.name}`}
                              fill
                              className="object-contain"
                              sizes="96px"
                              priority={index < 4}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col justify-between text-center">
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 leading-tight">
                            {brand.name}
                          </h3>
                          
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                            {brand.description}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium text-white border"
                            style={{ 
                              backgroundColor: brand.primaryColor + '20',
                              borderColor: brand.primaryColor + '40',
                              color: brand.primaryColor
                            }}
                          >
                            {brand.category}
                          </span>
                          
                          <motion.div
                            className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors duration-300"
                            whileHover={{ x: 3 }}
                          >
                            <ArrowRight className="w-4 h-4 text-black" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-yellow-500/30 transition-all duration-500" />
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.main>

        {/* Footer */}
        <motion.footer 
          className="text-center py-12 border-t border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <p className="text-gray-500 text-lg">
            © 2024 <span className="text-yellow-500 font-bold">TERRAZA EDEN</span> - Donde cada sabor cuenta una historia
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
