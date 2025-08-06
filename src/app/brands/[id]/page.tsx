'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, MessageCircle, ExternalLink, Bell, Star, Clock, Flame, Coffee, Wine, Sandwich, Cherry, Droplets, ChefHat, Pizza, Package } from 'lucide-react'
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

// Iconos personalizados para las categorías de Togoima
const togoimaCategoryIcons: { [key: string]: React.ReactNode } = {
  'tradicionales': <Coffee className="w-6 h-6" />,
  'rituales': <span className="text-2xl">☕</span>,
  'cacaos-chocolates': <span className="text-2xl">🍫</span>,
  'combos': <span className="text-2xl">🥪</span>,
  'hipotermicas': <span className="text-2xl">🧊</span>,
  'pecados': <span className="text-2xl">🍰</span>,
  'platos': <span className="text-2xl">🍽️</span>,
  'sandwiches': <span className="text-2xl">🥖</span>,
  'amasijos': <span className="text-2xl">🥐</span>,
  'destilados': <span className="text-2xl">🥃</span>,
  'mezclas': <span className="text-2xl">🍸</span>
}

// Iconos personalizados para las categorías de Ay Wey!
const ayWeyCategoryIcons: { [key: string]: React.ReactNode } = {
  'cocteleria': <Wine className="w-6 h-6" />,
  'aguas-frescas': <Droplets className="w-6 h-6" />,
  'entrantes': <ChefHat className="w-6 h-6" />,
  'tacos': <span className="text-2xl">🌮</span>,
  'volcanes': <span className="text-2xl">🌋</span>,
  'gringas': <Pizza className="w-6 h-6" />,
  'tortas': <Sandwich className="w-6 h-6" />,
  'adicionales': <Package className="w-6 h-6" />
}

// Iconos personalizados para las categorías de Perfetto
const perfettoCategoryIcons: { [key: string]: React.ReactNode } = {
  'frullatos': <span className="text-2xl">🥤</span>,
  'parfaits-gelatos': <span className="text-2xl">🍨</span>,
  'guarniciones': <Cherry className="w-6 h-6" />,
  'adicionales': <Package className="w-6 h-6" />
}

// Iconos personalizados para las categorías de Mazorca
const mazorcaCategoryIcons: { [key: string]: React.ReactNode } = {
  'mazorcas': <span className="text-2xl">🌽</span>
}

// Sistema de iconos específicos para productos
const getProductIcon = (productName: string, categoryId: string): string => {
  const name = productName.toLowerCase()
  
  // Iconos específicos por nombre de producto
  if (name.includes('taco')) return '🌮'
  if (name.includes('burrito')) return '🌯'
  if (name.includes('quesadilla')) return '🧀'
  if (name.includes('nachos')) return '🧀'
  if (name.includes('guacamole')) return '🥑'
  if (name.includes('salsa')) return '🌶️'
  if (name.includes('chile') || name.includes('chili')) return '🌶️'
  if (name.includes('jalapeño')) return '🌶️'
  if (name.includes('aguacate')) return '🥑'
  if (name.includes('tomate')) return '🍅'
  if (name.includes('cebolla')) return '🧅'
  if (name.includes('limón') || name.includes('limon')) return '🍋'
  
  // Bebidas
  if (name.includes('café') || name.includes('coffee')) return '☕'
  if (name.includes('cappuccino')) return '☕'
  if (name.includes('latte')) return '☕'
  if (name.includes('espresso')) return '☕'
  if (name.includes('americano')) return '☕'
  if (name.includes('frappé') || name.includes('frappe')) return '🥤'
  if (name.includes('frullatto') || name.includes('smoothie')) return '🥤'
  if (name.includes('jugo') || name.includes('juice')) return '🧃'
  if (name.includes('agua')) return '💧'
  if (name.includes('refresco') || name.includes('soda')) return '🥤'
  if (name.includes('té') || name.includes('tea')) return '🍵'
  if (name.includes('chocolate caliente')) return '☕'
  if (name.includes('limonada')) return '🍋'
  if (name.includes('naranjada')) return '🍊'
  
  // Alcohol
  if (name.includes('cerveza') || name.includes('beer')) return '🍺'
  if (name.includes('vino') || name.includes('wine')) return '🍷'
  if (name.includes('tequila')) return '🥃'
  if (name.includes('mezcal')) return '🥃'
  if (name.includes('ron')) return '🥃'
  if (name.includes('whisky') || name.includes('whiskey')) return '🥃'
  if (name.includes('vodka')) return '🥃'
  if (name.includes('margarita')) return '🍹'
  if (name.includes('mojito')) return '🍹'
  if (name.includes('piña colada')) return '🍹'
  
  // Comidas principales
  if (name.includes('pollo') || name.includes('chicken')) return '🍗'
  if (name.includes('carne') || name.includes('beef')) return '🥩'
  if (name.includes('res')) return '🥩'
  if (name.includes('cerdo') || name.includes('pork')) return '🐷'
  if (name.includes('pescado') || name.includes('fish')) return '🐟'
  if (name.includes('salmón') || name.includes('salmon')) return '🐟'
  if (name.includes('atún') || name.includes('tuna')) return '🐟'
  if (name.includes('camarón') || name.includes('shrimp')) return '🦐'
  if (name.includes('langosta') || name.includes('lobster')) return '🦞'
  if (name.includes('cordero') || name.includes('lamb')) return '🐑'
  if (name.includes('chuleta')) return '🥩'
  if (name.includes('filete')) return '🥩'
  if (name.includes('ribeye')) return '🥩'
  
  // Pastas y arroces
  if (name.includes('pasta')) return '🍝'
  if (name.includes('espagueti') || name.includes('spaghetti')) return '🍝'
  if (name.includes('lasagna') || name.includes('lasaña')) return '🍝'
  if (name.includes('risotto')) return '🍚'
  if (name.includes('arroz')) return '🍚'
  if (name.includes('paella')) return '🥘'
  
  // Sopas
  if (name.includes('sopa') || name.includes('soup')) return '🍲'
  if (name.includes('caldo')) return '🍲'
  if (name.includes('crema')) return '🍲'
  if (name.includes('consomé')) return '🍲'
  
  // Ensaladas
  if (name.includes('ensalada') || name.includes('salad')) return '🥗'
  if (name.includes('césar')) return '🥗'
  if (name.includes('caprese')) return '🥗'
  
  // Pan y sandwiches
  if (name.includes('sandwich') || name.includes('sándwich')) return '🥪'
  if (name.includes('torta')) return '🥪'
  if (name.includes('hamburguesa') || name.includes('burger')) return '🍔'
  if (name.includes('hot dog') || name.includes('perro')) return '🌭'
  if (name.includes('choripan') || name.includes('chorizo')) return '🌭'
  if (name.includes('pan')) return '🍞'
  if (name.includes('baguette')) return '🥖'
  if (name.includes('croissant')) return '🥐'
  if (name.includes('empanada')) return '🥟'
  if (name.includes('arepa')) return '🫓'
  
  // Postres y dulces
  if (name.includes('gelato') || name.includes('helado')) return '🍨'
  if (name.includes('parfait')) return '🍨'
  if (name.includes('tiramisú') || name.includes('tiramisu')) return '🍰'
  if (name.includes('cheesecake')) return '🍰'
  if (name.includes('brownie')) return '🍫'
  if (name.includes('chocolate')) return '🍫'
  if (name.includes('flan')) return '🍮'
  if (name.includes('pudín') || name.includes('pudding')) return '🍮'
  if (name.includes('mousse')) return '🍮'
  if (name.includes('tarta')) return '🥧'
  if (name.includes('pie')) return '🥧'
  if (name.includes('galleta') || name.includes('cookie')) return '🍪'
  if (name.includes('donut') || name.includes('dona')) return '🍩'
  if (name.includes('muffin')) return '🧁'
  if (name.includes('cupcake')) return '🧁'
  
  // Frutas
  if (name.includes('fresa') || name.includes('strawberry')) return '🍓'
  if (name.includes('mango')) return '🥭'
  if (name.includes('piña') || name.includes('pineapple')) return '🍍'
  if (name.includes('banana') || name.includes('plátano')) return '🍌'
  if (name.includes('manzana') || name.includes('apple')) return '🍎'
  if (name.includes('naranja') || name.includes('orange')) return '🍊'
  if (name.includes('limón') || name.includes('lemon')) return '🍋'
  if (name.includes('uva') || name.includes('grape')) return '🍇'
  if (name.includes('cereza') || name.includes('cherry')) return '🍒'
  if (name.includes('durazno') || name.includes('peach')) return '🍑'
  if (name.includes('kiwi')) return '🥝'
  if (name.includes('coco') || name.includes('coconut')) return '🥥'
  if (name.includes('maracuyá') || name.includes('passion')) return '🥭'
  
  // Verduras y vegetales
  if (name.includes('mazorca') || name.includes('elote') || name.includes('corn')) return '🌽'
  if (name.includes('papa') || name.includes('patata') || name.includes('potato')) return '🥔'
  if (name.includes('zanahoria') || name.includes('carrot')) return '🥕'
  if (name.includes('brócoli') || name.includes('broccoli')) return '🥦'
  if (name.includes('espinaca') || name.includes('spinach')) return '🥬'
  if (name.includes('lechuga') || name.includes('lettuce')) return '🥬'
  if (name.includes('apio') || name.includes('celery')) return '🥬'
  
  // Frutos secos y cereales
  if (name.includes('almendra') || name.includes('almond')) return '🥜'
  if (name.includes('nuez') || name.includes('walnut')) return '🥜'
  if (name.includes('maní') || name.includes('peanut')) return '🥜'
  if (name.includes('granola')) return '🥣'
  if (name.includes('cereal')) return '🥣'
  if (name.includes('avena') || name.includes('oats')) return '🥣'
  
  // Lácteos
  if (name.includes('queso') || name.includes('cheese')) return '🧀'
  if (name.includes('leche') || name.includes('milk')) return '🥛'
  if (name.includes('yogurt')) return '🥛'
  if (name.includes('crema')) return '🥛'
  
  // Condimentos y extras
  if (name.includes('salsa')) return '🥄'
  if (name.includes('aderezo')) return '🥄'
  if (name.includes('mayonesa')) return '🥄'
  if (name.includes('mostaza')) return '🥄'
  if (name.includes('ketchup')) return '🥄'
  if (name.includes('vinagre')) return '🥄'
  if (name.includes('aceite')) return '🥄'
  if (name.includes('mantequilla')) return '🧈'
  
  // Iconos por categoría como respaldo
  const categoryIcons: { [key: string]: string } = {
    'tradicionales': '☕',
    'rituales': '☕',
    'frullatos': '🥤',
    'hipotermicas': '🧊',
    'aguas-frescas': '💧',
    'cocteleria-mexicana': '🍹',
    'platos-principales': '🍽️',
    'entradas': '🥗',
    'tacos': '🌮',
    'volcanes': '🌋',
    'gringas': '🌯',
    'tortas': '🥪',
    'sandwiches': '🥖',
    'postres': '🍰',
    'parfaits-gelatos': '🍨',
    'cacaos-chocolates': '🍫',
    'guarniciones': '🥬',
    'adicionales': '➕',
    'amasijos': '🥐',
    'combos': '🍱',
    'pecados': '😈',
    'destilados': '🥃',
    'mezclas': '🍸',
    'platos': '🍽️',
    'mazorcas': '🌽'
  }
  
  return categoryIcons[categoryId] || '🍽️'
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

  // Diseño especial para marcas específicas
  const isTogoima = brand.id === 'togoima'
  const isAyWey = brand.id === 'ay-wey'
  const isPerfetto = brand.id === 'perfetto'
  const isMazorca = brand.id === 'mazorca'
  const hasSpecialDesign = isTogoima || isAyWey || isPerfetto || isMazorca

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
          {isTogoima ? (
            // Fondo especial para Togoima con patrón de café
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#3E2723] via-[#4E342E] to-[#5D4037] opacity-30" />
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B4513' fill-opacity='0.2'%3E%3Cpath d='M30 0c16.6 0 30 13.4 30 30S46.6 60 30 60 0 46.6 0 30 13.4 0 30 0zm0 10c11 0 20 9 20 20s-9 20-20 20S10 41 10 30s9-20 20-20z'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
              {/* Elementos flotantes animados */}
              <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">☕</div>
              <div className="absolute top-1/3 right-20 text-5xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>🫘</div>
              <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>☕</div>
              <div className="absolute bottom-1/3 right-1/3 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}>🍫</div>
            </>
          ) : isAyWey ? (
            // Fondo especial para Ay Wey! con patrón de chiles 🌶️
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-red-900 to-yellow-900 opacity-20" />
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234CAF50' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
              {/* Chiles flotantes animados */}
              <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">🌶️</div>
              <div className="absolute top-1/3 right-20 text-5xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>🌮</div>
              <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>🌶️</div>
              <div className="absolute bottom-1/3 right-1/3 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}>🥑</div>
            </>
          ) : isPerfetto ? (
            // Fondo especial para Perfetto con patrón de helados
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-yellow-900 to-red-900 opacity-20" />
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23228B22' fill-opacity='0.2'%3E%3Cpath d='M20 0c11 0 20 9 20 20s-9 20-20 20S0 31 0 20 9 0 20 0zm0 5c8.3 0 15 6.7 15 15s-6.7 15-15 15S5 28.3 5 20 11.7 5 20 5z'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
              {/* Helados flotantes animados */}
              <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">🍨</div>
              <div className="absolute top-1/3 right-20 text-5xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>🍦</div>
              <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>🍧</div>
              <div className="absolute bottom-1/3 right-1/3 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}>🍪</div>
            </>
          ) : isMazorca ? (
            // Fondo especial para Mazorca con patrón de maíz
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 via-amber-800 to-orange-900 opacity-20" />
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.2'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10zm10-10h10v10H20V0zm10 10h10v10H30V10z'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
              {/* Maíz flotante animado */}
              <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">🌽</div>
              <div className="absolute top-1/3 right-20 text-5xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>🌾</div>
              <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>🌽</div>
              <div className="absolute bottom-1/3 right-1/3 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}>🧀</div>
            </>
          ) : (
            <>
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
            </>
          )}
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
            ) : brand.id === 'ay-wey' ? (
              <span className="text-6xl">🌮</span>
            ) : brand.id === 'perfetto' ? (
              <span className="text-6xl">🍨</span>
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
              <span>ORDENAR DESDE PÁGINA OFICIAL</span>
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
        {/* Category Tabs - Diseño especial */}
        {hasSpecialDesign ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {brand.menu.categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`relative p-6 rounded-2xl transition-all duration-300 group border ${
                  selectedCategory === category.id
                    ? 'shadow-2xl scale-105'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id 
                    ? isAyWey ? '#4CAF5020' 
                    : isPerfetto ? '#228B2220'
                    : isMazorca ? '#FFD70020'
                    : isTogoima ? '#8B451320'
                    : '#D2691E20'
                    : isAyWey ? '#4CAF5010'
                    : isPerfetto ? '#228B2210'
                    : isMazorca ? '#FFD70010'
                    : isTogoima ? '#3E272310'
                    : '#8B451310',
                  borderColor: selectedCategory === category.id
                    ? isAyWey ? '#4CAF50'
                    : isPerfetto ? '#228B22'
                    : isMazorca ? '#FFD700'
                    : isTogoima ? '#8B4513'
                    : '#D2691E'
                    : isAyWey ? '#4CAF5030'
                    : isPerfetto ? '#228B2230'
                    : isMazorca ? '#FFD70030'
                    : isTogoima ? '#8B451330'
                    : '#8B451330',
                  boxShadow: selectedCategory === category.id
                    ? isAyWey ? `0 20px 40px #4CAF5030`
                    : isPerfetto ? `0 20px 40px #228B2230`
                    : isMazorca ? `0 20px 40px #FFD70030`
                    : isTogoima ? `0 20px 40px #8B451340`
                    : `0 20px 40px #D2691E30`
                    : 'none'
                }}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ 
                  backgroundColor: isAyWey ? '#4CAF5015'
                  : isPerfetto ? '#228B2215'
                  : isMazorca ? '#FFD70015'
                  : isTogoima ? '#3E272315'
                  : '#D2691E15'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: selectedCategory === category.id 
                        ? isAyWey ? '#4CAF50'
                        : isPerfetto ? '#228B22'
                        : isMazorca ? '#FFD700'
                        : isTogoima ? '#8B4513'
                        : '#D2691E'
                        : isAyWey ? '#4CAF5050'
                        : isPerfetto ? '#228B2250'
                        : isMazorca ? '#FFD70050'
                        : isTogoima ? '#8B451350'
                        : '#8B451350',
                      color: selectedCategory === category.id ? 'white'
                        : isAyWey ? '#4CAF50'
                        : isPerfetto ? '#228B22'
                        : isMazorca ? '#8B4513'
                        : isTogoima ? '#DEB887'
                        : '#D2691E'
                    }}
                  >
                    {isAyWey 
                      ? (ayWeyCategoryIcons[category.id] || <span className="text-2xl">🌮</span>)
                      : isPerfetto
                        ? (perfettoCategoryIcons[category.id] || <span className="text-2xl">🍨</span>)
                        : isMazorca
                          ? (mazorcaCategoryIcons[category.id] || <span className="text-2xl">🌽</span>)
                          : (togoimaCategoryIcons[category.id] || <Coffee className="w-6 h-6" />)
                    }
                  </div>
                  <span 
                    className={`font-bold text-sm md:text-base ${
                      selectedCategory === category.id
                        ? isAyWey ? 'text-green-400'
                        : isPerfetto ? 'text-green-400'
                        : isMazorca ? 'text-yellow-400'
                        : 'text-orange-400'
                        : isAyWey ? 'text-green-200'
                        : isPerfetto ? 'text-green-200'
                        : isMazorca ? 'text-yellow-200'
                        : 'text-amber-200'
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
                
                {/* Indicador de items */}
                <div 
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                  style={{
                    backgroundColor: isAyWey ? '#F44336'
                    : isPerfetto ? '#DC143C'
                    : isMazorca ? '#FF8C00'
                    : '#8B4513'
                  }}
                >
                  {category.items.length}
                </div>

                {/* Efectos especiales */}
                {isAyWey && selectedCategory === category.id && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    🌶️
                  </div>
                )}
                {isPerfetto && selectedCategory === category.id && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    🍨
                  </div>
                )}
                {isMazorca && selectedCategory === category.id && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    🌽
                  </div>
                )}
                {isTogoima && selectedCategory === category.id && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    ☕
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          // Diseño normal para otras marcas
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
        )}

        {/* Menu Items - Diseño especial para Togoima y Ay Wey! */}
        <AnimatePresence mode="wait">
          {selectedCategoryData && (
            <motion.div
              key={selectedCategory}
              className={`grid ${
                hasSpecialDesign 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              } gap-6`}
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
                    className={`group overflow-hidden border backdrop-blur-md hover:backdrop-blur-lg transition-all duration-500 h-full ${
                      hasSpecialDesign ? 'hover:shadow-2xl' : ''
                    }`}
                    style={{
                      backgroundColor: isAyWey 
                        ? 'rgba(76, 175, 80, 0.1)' 
                        : isPerfetto 
                          ? 'rgba(34, 139, 34, 0.1)' 
                          : isMazorca 
                            ? 'rgba(255, 215, 0, 0.1)' 
                            : isTogoima 
                              ? 'rgba(139, 69, 19, 0.1)' 
                              : 'rgba(17, 24, 39, 0.8)',
                      borderColor: isAyWey 
                        ? '#4CAF5030' 
                        : isPerfetto 
                          ? '#228B2230' 
                          : isMazorca 
                            ? '#FFD70030' 
                            : isTogoima 
                              ? '#D2691E30' 
                              : brand.primaryColor + '30'
                    }}
                  >
                    {/* Item Image or Icon */}
                    <div 
                      className={`${hasSpecialDesign ? 'h-32' : 'h-40'} relative overflow-hidden`}
                      style={{
                        background: isAyWey 
                          ? `linear-gradient(135deg, #4CAF5020, #F4433620)`
                          : isPerfetto
                            ? `linear-gradient(135deg, #228B2220, #DC143C20)`
                            : isMazorca
                              ? `linear-gradient(135deg, #FFD70020, #FF8C0020)`
                              : isTogoima 
                                ? `linear-gradient(135deg, #8B451320, #D2691E20)`
                                : `linear-gradient(45deg, ${brand.primaryColor}20, ${brand.secondaryColor}20)`
                      }}
                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className={`${hasSpecialDesign ? 'w-16 h-16' : 'w-20 h-20'} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                      style={{ 
                        backgroundColor: isAyWey 
                          ? '#4CAF50'
                          : isPerfetto
                            ? '#228B22'
                            : isMazorca
                              ? '#FFD700'
                              : isTogoima 
                                ? '#8B4513'
                                : brand.primaryColor,
                        boxShadow: isAyWey 
                          ? `0 8px 25px #4CAF5040`
                          : isPerfetto
                            ? `0 8px 25px #228B2240`
                            : isMazorca
                              ? `0 8px 25px #FFD70040`
                              : isTogoima 
                                ? `0 8px 25px #D2691E40`
                                : `0 8px 25px ${brand.primaryColor}40`,
                        fontSize: hasSpecialDesign ? '2rem' : '1.75rem',
                        color: isMazorca ? '#8B4513' : 'white'
                      }}
                    >
                      {item.imageIcon || getProductIcon(item.name, selectedCategory)}
                    </div>
                  </div>
                      
                      {/* Hover Overlay */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{ 
                          backgroundColor: isAyWey 
                            ? '#FFC10760' 
                            : isPerfetto 
                              ? '#DC143C60' 
                              : isMazorca 
                                ? '#FF8C0060' 
                                : isTogoima 
                                  ? '#DEB88760' 
                                  : brand.accentColor + '60' 
                        }}
                      >
                        <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
                          {isAyWey ? '¡Órale!'
                          : isPerfetto ? '¡Delizioso!'
                          : isMazorca ? '¡Qué rico!'
                          : '¡Delicioso!'}
                        </span>
                      </div>

                      {/* Decoración especial */}
                      {isAyWey && (
                        <div className="absolute top-2 right-2 text-xl opacity-60">
                          🌶️
                        </div>
                      )}
                      {isPerfetto && (
                        <div className="absolute top-2 right-2 text-xl opacity-60">
                          🍨
                        </div>
                      )}
                      {isMazorca && (
                        <div className="absolute top-2 right-2 text-xl opacity-60">
                          🌽
                        </div>
                      )}
                      {isTogoima && (
                        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                          ☕
                        </div>
                      )}
                    </div>

                    <CardContent className={`${hasSpecialDesign ? 'p-4' : 'p-6'}`}>
                      <div className="space-y-4">
                        <div>
                          <h3 className={`${hasSpecialDesign ? 'text-base' : 'text-lg'} font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors`}>
                            {item.name}
                          </h3>
                          
                          <p className={`text-gray-400 ${hasSpecialDesign ? 'text-xs' : 'text-sm'} leading-relaxed line-clamp-3 mb-4`}>
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span 
                            className={`${hasSpecialDesign ? 'text-xl' : 'text-2xl'} font-bold`}
                            style={{ 
                              color: isAyWey 
                                ? '#FFC107' 
                                : isPerfetto 
                                  ? '#DC143C' 
                                  : isMazorca 
                                    ? '#FFD700' 
                                    : isTogoima 
                                      ? '#FF8C00' 
                                      : brand.primaryColor
                            }}
                          >
                            {formatPrice(item.price)}
                          </span>

                          {!hasSpecialDesign && (
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
                          )}
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
        {(brand.contact.whatsapp || brand.contact.callWaiter) && (
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">
                {isAyWey ? '¿Listo para ordenar, amigo? ��'
                : isPerfetto ? '¿Listo para disfrutar? 🍨'
                : isMazorca ? '¿Antojo de mazorca? 🌽'
                : isTogoima ? '¿Un café ancestral? ☕'
                : '¿Listo para ordenar?'}
              </h3>
              
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
                      backgroundColor: isAyWey 
                        ? '#F44336'
                        : isPerfetto
                          ? '#DC143C'
                          : isMazorca
                            ? '#FF8C00'
                            : isTogoima
                              ? '#8B4513'
                              : brand.primaryColor,
                      borderColor: isAyWey 
                        ? '#FFC107'
                        : isPerfetto
                          ? '#FFD700'
                        : isMazorca
                          ? '#FFD700'
                        : isTogoima
                          ? '#DEB887'
                          : brand.secondaryColor
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: isAyWey 
                        ? '#D32F2F'
                        : isPerfetto
                          ? '#B71C1C'
                          : isMazorca
                            ? '#F57C00'
                            : isTogoima
                              ? '#654321'
                              : brand.accentColor
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
        )}
      </motion.main>
    </motion.div>
  )
} 