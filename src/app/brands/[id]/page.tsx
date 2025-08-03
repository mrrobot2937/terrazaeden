'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Clock, Flame } from 'lucide-react'
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
  const [cart, setCart] = useState<Record<string, number>>({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  const brand: Brand | undefined = brandsData.brands.find(b => b.id === resolvedParams.id)

  useEffect(() => {
    setMounted(true)
    
    if (brand && brand.menu.categories.length > 0) {
      setSelectedCategory(brand.menu.categories[0].id)
    }
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

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }))
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
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

          {/* Cart */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="p-3 rounded-full backdrop-blur-md border cursor-pointer transition-all duration-300"
              style={{ 
                backgroundColor: brand.primaryColor + '20',
                borderColor: brand.primaryColor + '40',
                boxShadow: `0 4px 20px ${brand.primaryColor}20`
              }}
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {getTotalItems() > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                  style={{ backgroundColor: brand.accentColor }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </div>
          </motion.div>
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

        <motion.p 
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {brand.description}
        </motion.p>

        <motion.div
          className="flex justify-center space-x-4 flex-wrap gap-2"
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
                          Ver detalles
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4 h-32 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors">
                            {item.name}
                          </h3>
                          
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span 
                            className="text-xl font-bold"
                            style={{ 
                              color: brand.primaryColor
                            }}
                          >
                            {formatPrice(item.price)}
                          </span>

                          <div className="flex items-center space-x-2">
                            {cart[item.id] > 0 && (
                              <motion.button
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border"
                                style={{
                                  backgroundColor: brand.accentColor,
                                  borderColor: brand.accentColor
                                }}
                                onClick={() => removeFromCart(item.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Minus className="w-4 h-4 text-white" />
                              </motion.button>
                            )}

                            {cart[item.id] > 0 && (
                              <motion.span 
                                className="text-white font-bold text-lg min-w-[2rem] text-center px-2 py-1 rounded-full"
                                style={{ backgroundColor: brand.secondaryColor + '40' }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                key={cart[item.id]}
                              >
                                {cart[item.id]}
                              </motion.span>
                            )}

                            <motion.button
                              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors border"
                              style={{ 
                                backgroundColor: brand.primaryColor,
                                borderColor: brand.secondaryColor,
                                color: 'white',
                                boxShadow: `0 4px 15px ${brand.primaryColor}40`
                              }}
                              onClick={() => addToCart(item.id)}
                              whileHover={{ 
                                scale: 1.1,
                                backgroundColor: brand.accentColor,
                                boxShadow: `0 6px 20px ${brand.accentColor}50`
                              }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-5 h-5" />
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
      </motion.main>
    </motion.div>
  )
} 