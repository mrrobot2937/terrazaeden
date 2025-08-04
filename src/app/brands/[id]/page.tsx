'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, MessageCircle, ExternalLink, Bell, Star, Clock, Flame, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import brandsData from '@/data/brands.json'
import { Brand } from '@/types/brand'
import { formatPrice } from '@/lib/utils'

interface Props {
  params: Promise<{
    id: string
  }>
}

const pageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.1 }
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 100
    }
  }
}

export default function BrandPage({ params }: Props) {
  const resolvedParams = use(params)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  const brand: Brand | undefined = brandsData.brands.find(b => b.id === resolvedParams.id)

  useEffect(() => {
    setMounted(true)
    
    if (brand && brand.menu.categories.length > 0) {
      setSelectedCategory(brand.menu.categories[0].id)
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [brand])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mounted])

  if (!brand) {
    notFound()
  }

  const handleWhatsAppClick = () => {
    if (brand.contact.whatsapp) {
      const message = encodeURIComponent(brand.contact.whatsappMessage || `Hola, me interesa el menú de ${brand.name}`)
      window.open(`https://wa.me/${brand.contact.whatsapp.replace('+', '')}?text=${message}`, '_blank')
    }
  }

  const handleOfficialWebsite = () => {
    if (brand.contact.officialWebsite) {
      window.open(brand.contact.officialWebsite, '_blank')
    }
  }

  const handleCallWaiter = () => {
    // Aquí podrías integrar con un sistema de notificaciones real
    alert(`¡Mesero notificado! Alguien vendrá a tu mesa para atender tu pedido de ${brand.name} 🔔`)
  }

  const selectedCategoryData = brand.menu.categories.find(cat => cat.id === selectedCategory)

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden bg-black"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.6 }}
    >
      {/* Dynamic Background - Only render after mount */}
      {mounted && (
        <div className="absolute inset-0">
          <div 
            className="absolute w-96 h-96 rounded-full filter blur-3xl opacity-15 transition-transform duration-1000 ease-out"
            style={{
              backgroundColor: brand.primaryColor,
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
          <div 
            className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-10 transition-transform duration-1000 ease-out"
            style={{
              backgroundColor: brand.secondaryColor,
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
            }}
          />
          <div 
            className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full filter blur-3xl opacity-8 transition-transform duration-1000 ease-out"
            style={{
              backgroundColor: brand.accentColor,
              transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
            }}
          />
        </div>
      )}

      {/* Header */}
      <motion.header 
        className="relative z-10 p-6 border-b border-gray-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-3 text-white hover:text-yellow-400 transition-colors group"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors duration-300 group-hover:text-black">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Volver a Terraza Eden</span>
            </motion.div>
          </Link>

          {/* Contact Actions */}
          <div className="flex items-center space-x-3">
            {/* WhatsApp Button */}
            {brand.contact.whatsapp && (
              <motion.button
                onClick={handleWhatsAppClick}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </motion.button>
            )}

            {/* Call Waiter Button */}
            {brand.contact.callWaiter && (
              <motion.button
                onClick={handleCallWaiter}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-white font-medium transition-colors duration-300"
                style={{ 
                  backgroundColor: brand.primaryColor + '80',
                  borderColor: brand.primaryColor
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: brand.accentColor + '90'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Llamar Mesero</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Brand Hero */}
      <motion.section 
        className="relative z-10 text-center py-16 px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="inline-block mb-8"
          animate={{
            y: [0, -8, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div 
            className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md border-2 overflow-hidden"
            style={{ 
              backgroundColor: 'white',
              borderColor: brand.primaryColor,
              boxShadow: `0 20px 60px ${brand.primaryColor}30`
            }}
          >
            {brand.id === 'mazorca' ? (
              <span className="text-6xl">🌽</span>
            ) : brand.id === 'choripam' ? (
              <span className="text-6xl">🌭</span>
            ) : (
              <div className="relative w-24 h-24">
                <Image
                  src={brand.logo}
                  alt={`Logo de ${brand.name}`}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                  priority
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Título - Especial para Togoima */}
        {brand.id === 'togoima' ? (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full max-w-2xl mx-auto h-32 md:h-40">
              <Image
                src="/logos/togoima_letra.png"
                alt="Togoima Logo"
                fill
                className="object-contain"
                style={{
                  filter: `drop-shadow(0 0 30px ${brand.primaryColor}60)`
                }}
                priority
              />
            </div>
          </motion.div>
        ) : (
          <motion.h1 
            className="text-5xl md:text-7xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              textShadow: `0 0 30px ${brand.primaryColor}60`
            }}
          >
            {brand.name}
          </motion.h1>
        )}

        <motion.p 
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {brand.description}
        </motion.p>

        <motion.div
          className="flex justify-center space-x-4 flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div 
            className="flex items-center space-x-2 px-4 py-2 backdrop-blur-md rounded-full border"
            style={{
              backgroundColor: brand.primaryColor + '15',
              borderColor: brand.primaryColor + '30'
            }}
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">4.8</span>
          </div>
          <div 
            className="flex items-center space-x-2 px-4 py-2 backdrop-blur-md rounded-full border"
            style={{
              backgroundColor: brand.secondaryColor + '15',
              borderColor: brand.secondaryColor + '30'
            }}
          >
            <Clock className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">15-25 min</span>
          </div>
          <div 
            className="flex items-center space-x-2 px-4 py-2 backdrop-blur-md rounded-full border"
            style={{
              backgroundColor: brand.accentColor + '15',
              borderColor: brand.accentColor + '30'
            }}
          >
            <Flame className="w-5 h-5 text-red-400" />
            <span className="text-white font-medium">Popular</span>
          </div>
        </motion.div>

        {/* Official Website Button - Solo para Choripam */}
        {brand.contact.officialWebsite && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              onClick={handleOfficialWebsite}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: `0 8px 30px ${brand.primaryColor}40`
              }}
            >
              <ExternalLink className="w-6 h-6" />
              <span>VISITAR PÁGINA OFICIAL</span>
              <ExternalLink className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </motion.section>

      {/* Menu Section */}
      <motion.main 
        className="relative z-10 max-w-7xl mx-auto px-6 pb-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {/* Category Tabs */}
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
          {brand.menu.categories.map((category, index) => (
            <motion.button
              key={category.id}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap border ${
                selectedCategory === category.id
                  ? 'text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id 
                  ? brand.primaryColor 
                  : brand.primaryColor + '10',
                borderColor: selectedCategory === category.id
                  ? brand.secondaryColor
                  : brand.primaryColor + '30',
                boxShadow: selectedCategory === category.id
                  ? `0 8px 25px ${brand.primaryColor}30`
                  : 'none'
              }}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: selectedCategory === category.id ? brand.accentColor : brand.primaryColor + '20'
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          {selectedCategoryData && (
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {selectedCategoryData.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card 
                    className="group overflow-hidden border backdrop-blur-md hover:backdrop-blur-lg transition-all duration-500 h-full"
                    style={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      borderColor: brand.primaryColor + '30'
                    }}
                  >
                    {/* Item Image Placeholder */}
                    <div 
                      className="h-40 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(45deg, ${brand.primaryColor}20, ${brand.secondaryColor}20)`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                          style={{ 
                            backgroundColor: brand.primaryColor,
                            boxShadow: `0 8px 25px ${brand.primaryColor}40`
                          }}
                        >
                          {item.name.charAt(0)}
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{ backgroundColor: brand.accentColor + '60' }}
                      >
                        <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
                          ¡Delicioso!
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors">
                            {item.name}
                          </h3>
                          
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span 
                            className="text-2xl font-bold"
                            style={{ 
                              color: brand.primaryColor
                            }}
                          >
                            {formatPrice(item.price)}
                          </span>

                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={handleWhatsAppClick}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm font-medium transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Pedir</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">¿Listo para ordenar?</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* WhatsApp Button */}
              {brand.contact.whatsapp && (
                <motion.button
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-700 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Ordenar por WhatsApp</span>
                </motion.button>
              )}

              {/* Call Waiter Button */}
              {brand.contact.callWaiter && (
                <motion.button
                  onClick={handleCallWaiter}
                  className="flex items-center justify-center space-x-3 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: brand.primaryColor,
                    borderColor: brand.secondaryColor
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: brand.accentColor
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-6 h-6" />
                  <span>Llamar Mesero</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.main>
    </motion.div>
  )
} 