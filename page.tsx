'use client'

import { useState, useMemo } from 'react'
import { Search, MessageCircle, Eye } from 'lucide-react'
import useSWR from 'swr'

type Product = {
  id: number
  nome: string
  categoria: string
  descricao: string
  imagem_url?: string | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Don't put a default [] in the useSWR destructure — normalize after reading `data`
  const { data, isLoading } = useSWR<any>('/api/products', fetcher)
  const products: Product[] = Array.isArray(data) ? data : data?.products ?? []

  // Build categories without using spread on Set (avoids downlevelIteration issue)
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p: Product) => p.categoria)))
    const cats = ['Todos', ...uniqueCategories]
    return cats.map((cat) => ({
      name: cat,
      count:
        cat === 'Todos'
          ? products.length
          : products.filter((p: Product) => p.categoria === cat).length,
    }))
  }, [products])

  const handleWhatsApp = (product?: Product | null) => {
    const baseText = product
      ? `Interesse no catálogo B3 Móveis - ${product.nome}`
      : 'Interesse no catálogo B3 Móveis'
    const url = `https://wa.me/5581999999999?text=${encodeURIComponent(baseText)}`
    // guard for environment where window may be undefined
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  }

  const filteredProducts = products.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((p) => (selectedCategory === 'Todos' ? true : p.categoria === selectedCategory))

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold">B3 MÓVEIS CORPORATIVOS</h1>
          <p>Catálogo Digital</p>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Buscar móveis..."
            className="flex-1 p-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border rounded-lg"
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow">
                {/* don't use next/image here unless you configured next.config.js domains.
                    Use a normal <img> and a guarded render to avoid invalid src errors */}
                {product.imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imagem_url}
                    alt={product.nome}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
                    Sem imagem
                  </div>
                )}

                <h3 className="font-bold">{product.nome}</h3>
                <p className="text-blue-600">{product.categoria}</p>
                <p className="text-gray-600 text-sm">{product.descricao}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                    }}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Ver detalhes
                  </button>

                  <button
                    onClick={() => handleWhatsApp(product)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => handleWhatsApp(null)}
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full"
        >
          <MessageCircle className="h-6 w-6" />
        </button>

        {/* modal: render only when selectedProduct exists and use optional chaining */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSelectedProduct(null)}
            />
            <div className="bg-white rounded-lg max-w-2xl w-full relative p-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedProduct?.nome}</h2>
              <p className="text-blue-600 mb-4">{selectedProduct?.categoria}</p>
              <p className="text-gray-600 mb-6">{selectedProduct?.descricao}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => selectedProduct && handleWhatsApp(selectedProduct)}
                  className="w-full bg-green-500 text-white py-3 rounded-lg"
                >
                  Solicitar Orçamento
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}