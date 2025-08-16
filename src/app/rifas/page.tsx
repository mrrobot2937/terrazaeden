'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { graphqlRequest } from '@/lib/graphql'
import { CheckCircle2, AlertCircle, ExternalLink, Instagram, Ticket, Calendar, Trophy, ChevronRight } from 'lucide-react'
import brandsData from '@/data/brands.json'
import { Brand } from '@/types/brand'

export default function RifasPage() {
  const [instagramUser, setInstagramUser] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const brandsGridRef = useRef<HTMLDivElement>(null)

  // Marcas adicionales externas (no vienen de brands.json)
  const externalBrands = [
    { name: 'Sabor Extremo Gourmet', handle: '@saborextremogourmet', url: 'https://www.instagram.com/saborextremogourmet/' },
    { name: 'Fundación FEDI', handle: '@fundacionfedi', url: 'https://www.instagram.com/fundacionfedi' },
    { name: 'Josué', handle: '@josuee1.6', url: 'https://www.instagram.com/josuee1.6' },
    { name: 'PC Mobile Colombia', handle: '@pcmobilecolombia', url: 'https://www.instagram.com/pcmobilecolombia' },
    { name: 'Marden Colombia', handle: '@marden_colombia', url: 'https://www.instagram.com/marden_colombia' },
    { name: 'Salsamentaria La Mejor', handle: '@salsamentaria_lamejor', url: 'https://www.instagram.com/salsamentaria_lamejor' },
    { name: 'Car Wash Obrero', handle: '@carwashobrero_', url: 'https://www.instagram.com/carwashobrero_' }
  ]

  const handleAutoScroll = () => {
    if (brandsGridRef.current) {
      const container = brandsGridRef.current
      const cardWidth = 280 // Aproximadamente el ancho de una tarjeta + gap
      const currentScroll = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      
      // Si estamos al final, volver al inicio
      if (currentScroll >= maxScroll - 10) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        })
      } else {
        // Scroll hacia la derecha por 2 tarjetas
        container.scrollTo({
          left: currentScroll + (cardWidth * 2),
          behavior: 'smooth'
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = instagramUser.trim()
    if (!trimmed) {
      setError('Por favor ingresa tu usuario de Instagram')
      return
    }
    if (!/^@?[a-zA-Z0-9._]{1,30}$/.test(trimmed)) {
      setError('Usuario inválido. Solo letras, números, punto y guion bajo')
      return
    }

    setSubmitting(true)
    try {
      // Construir lista de marcas a registrar (handles sin @)
      const enabledBrandHandles = (brandsData.brands as Brand[])
        .filter(b => b.raffle?.enabled && (b.contact?.instagramHandle || b.contact?.instagramUrl))
        .map(b => {
          const handle = b.contact?.instagramHandle || `@${(b.contact?.instagramUrl as string).replace(/\/$/, '').split('/').pop()}`
          return handle.replace(/^@/, '')
        })

      const extraHandles = externalBrands.map(b => b.handle.replace(/^@/, ''))

      const variables = {
        input: {
          instagram: trimmed,
          brands: [...enabledBrandHandles, ...extraHandles],
          referrer: 'rifas-page'
        },
        tenantId: 'terraza-eden'
      }

      const mutation = `
        mutation CreateRaffleSignup($input: CreateRaffleSignupInput!, $tenantId: String) {
          createRaffleSignup(input: $input, tenantId: $tenantId) {
            success
            message
            id
          }
        }
      `

      type MutationResponse = { createRaffleSignup: { success: boolean; message: string; id?: string } }
      const res = await graphqlRequest<MutationResponse>(mutation, variables)

      if (!res.createRaffleSignup?.success) {
        throw new Error(res.createRaffleSignup?.message || 'Error desconocido')
      }

      setSubmitted(true)
    } catch (e) {
      setError('No pudimos registrar tu participación. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <motion.header 
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">← Volver</Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Rifas y Bonos</h1>
          <div />
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-yellow-500/30 bg-gray-900/60 backdrop-blur">
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-500 text-black shadow-lg">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Participa por bonos</h2>
                <p className="text-gray-300 mt-1">Para participar, primero sigue a <a href="https://www.instagram.com/terrazaeleden/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">@terrazaeleden</a> y a todas las marcas listadas abajo. Luego deja tu usuario de Instagram en el formulario.</p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Formulario de inscripción */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-gray-800 bg-gray-900/60 backdrop-blur">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-300 mb-2">Usuario de Instagram</span>
                <div className="flex items-stretch gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-400 flex-shrink-0">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="text"
                    inputMode="text"
                    placeholder="@tu_usuario"
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black/40 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500/60 text-sm sm:text-base"
                    value={instagramUser}
                    onChange={(e) => setInstagramUser(e.target.value)}
                    aria-label="Usuario de Instagram"
                  />
                </div>
              </label>

              <div className="text-sm text-gray-400 space-y-1">
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Sigue a <a href="https://instagram.com/terrazaelden" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">@terrazaelden</a></p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Sigue al restaurante que otorga el bono (ver rifas activas abajo)</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              {!submitted ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-3 sm:py-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold border border-yellow-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {submitting ? 'Enviando...' : 'Inscribirme en las rifas'}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-400 font-medium flex items-center gap-2 text-sm sm:text-base"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> ¡Listo! Te inscribiste correctamente.</p>
                  <a href="https://instagram.com/terrazaeleden" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm sm:text-base">
                    Ir a Instagram <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                </div>
              )}
            </form>
          </Card>
        </motion.section>

        {/* Botón central para seguir a Terraza Eden */}
        <motion.section
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-green-600/40 bg-green-900/20 backdrop-blur">
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-white font-bold text-lg">Sigue primero a @terrazaeleden</p>
                <p className="text-gray-300 text-sm">Es el paso inicial para participar en cualquiera de los bonos.</p>
              </div>
              <a
                href="https://www.instagram.com/terrazaeleden/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-500 hover:bg-green-400 text-black font-extrabold border border-green-300 transition-colors"
              >
                <Instagram className="w-5 h-5" /> Seguir @terrazaeleden
              </a>
            </div>
          </Card>
        </motion.section>

        {/* Marcas participantes */}
        <motion.section 
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-white font-bold text-lg mb-2">Marcas participantes</h3>
          <p className="text-gray-400 text-sm mb-4">Sigue a <a className="text-yellow-400 hover:text-yellow-300 underline" href="https://www.instagram.com/terrazaeleden/" target="_blank" rel="noopener noreferrer">@terrazaeleden</a> y a cada una de las siguientes marcas para poder participar por alguno de los bonos.</p>
          
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 flex md:flex-none overflow-x-auto md:overflow-visible gap-3 pb-4 md:pb-0" 
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               ref={brandsGridRef}>
            {/* Marcas de brands.json con rifas activas */}
            {(brandsData.brands as Brand[])
              .filter(b => b.raffle?.enabled && b.contact?.instagramUrl)
              .map((brand) => {
                const brandIgUrl = brand.contact.instagramUrl as string
                const brandHandle = brand.contact.instagramHandle || `@${brandIgUrl.replace(/\/$/, '').split('/').pop()}`
                return (
                  <Card key={brand.id} className="border border-gray-800 bg-gray-900/50 flex-shrink-0 w-64 md:w-auto">
                    <div className="p-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{brand.name}</p>
                        <a className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 text-xs" href={brandIgUrl} target="_blank" rel="noopener noreferrer">
                          <Instagram className="w-3 h-3" /> {brandHandle}
                        </a>
                      </div>
                      <a className="px-2 py-1 rounded bg-yellow-500 text-black font-medium text-xs border border-yellow-300 hover:bg-yellow-400 whitespace-nowrap" href={brandIgUrl} target="_blank" rel="noopener noreferrer">Seguir</a>
                    </div>
                  </Card>
                )
              })}
            
            {/* Marcas adicionales */}
            {externalBrands.map((brand) => (
              <Card key={brand.handle} className="border border-gray-800 bg-gray-900/50 flex-shrink-0 w-64 md:w-auto">
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{brand.name}</p>
                    <a className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 text-xs" href={brand.url} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-3 h-3" /> {brand.handle}
                    </a>
                  </div>
                  <a className="px-2 py-1 rounded bg-yellow-500 text-black font-medium text-xs border border-yellow-300 hover:bg-yellow-400 whitespace-nowrap" href={brand.url} target="_blank" rel="noopener noreferrer">Seguir</a>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Botón fijo para deslizar (solo móvil) */}
      <motion.button
        onClick={handleAutoScroll}
        className="md:hidden fixed bottom-6 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-4 py-3 rounded-full shadow-2xl border-2 border-yellow-300 z-50 flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", bounce: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
        <span className="text-sm font-extrabold">Deslizar</span>
      </motion.button>

      {/* Añadir estilos para ocultar scrollbar */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}


