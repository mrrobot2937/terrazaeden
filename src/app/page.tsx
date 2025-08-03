'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ArrowRight, Sparkles, ChefHat } from 'lucide-react'
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
  const [particles] = useState(generateParticles)
  const brands: Brand[] = brandsData.brands

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements - Only render after mount */}
      {mounted && (
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

      {/* Floating particles - Only render after mount */}
      {mounted && (
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
        {/* Header */}
        <motion.header 
          className="text-center py-20 px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center justify-center space-x-3 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-10 h-10 text-black" />
            </div>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
          
          <motion.h1 
            className="text-7xl md:text-9xl font-black text-white mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              textShadow: '0 0 50px rgba(234, 179, 8, 0.3)'
            }}
          >
            TERRAZA
            <span className="text-yellow-500 block">EDEN</span>
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            EL DESTINO GASTRONÓMICO <span className="text-yellow-500 font-bold">MÁS EXCLUSIVO</span>
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="inline-block px-8 py-4 bg-yellow-500 text-black font-bold text-lg rounded-full hover:bg-yellow-400 transition-colors cursor-pointer">
              ⚡ EXPLORA NUESTRAS MARCAS ⚡
            </div>
          </motion.div>
        </motion.header>

        {/* Brands Grid */}
        <motion.main 
          className="container mx-auto px-6 pb-20"
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
                    {/* Brand Color Accent */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: brand.primaryColor }}
                    />
                    
                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                      style={{ backgroundColor: brand.primaryColor }}
                    />

                    <div className="relative z-10 p-6 h-full flex flex-col">
                      {/* Logo Section - Fixed size container */}
                      <div className="flex-shrink-0 flex items-center justify-center mb-6 h-24">
                        <div
                          className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                          style={{
                            boxShadow: `0 4px 20px ${brand.primaryColor}30`
                          }}
                        >
                          {brand.id === 'mazorca' ? (
                            <span className="text-3xl">🌽</span>
                          ) : brand.id === 'choripam' ? (
                            <span className="text-3xl">🌭</span>
                          ) : (
                            <div className="relative w-16 h-16">
                              <Image
                                src={brand.logo}
                                alt={`Logo de ${brand.name}`}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                                priority={index < 4}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Brand Info - Flexible container */}
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

                    {/* Animated Border */}
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
