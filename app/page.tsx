'use client'

import { useState } from 'react'
import { Search, MessageCircle, Eye } from 'lucide-react'
import useSWR from 'swr'
import Image from 'next/image'

type Product = {
  id: number
  nome: string
  categoria: string
  descricao: string
  imagem_url: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Tipagem segura para a resposta da API: pode ser um array direto ou um objeto { products: [...] }
  type SWRData = Product[] | { products: Product[] } | undefined
  const { data, isLoading } = useSWR<SWRData>('/api/products', fetcher)

  // Normaliza a resposta em Product[]
  const products: Product[] = Array.isArray(data) ? data : (data && (data as any).products) ?? []

  const handleWhatsApp = (product: Product) => {
    if (!product) return
    const message = `B3 Móveis - ${product.nome}\nCategoria: ${product.categoria}\n\nSolicitar orçamento!`
    const phoneNumber = '5581999999999'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const filteredProducts: Product[] = products.filter((product) => {
    if (!product || !product.nome) return false
    const searchMatch = searchTerm === '' || product.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const categoryMatch = selectedCategory === 'Todos' || product.categoria === selectedCategory
    return searchMatch && categoryMatch
  })

  const categories = ['Todos', 'Cadeiras', 'Mesas', 'Estações', 'Armários']

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B3</span>
              </div>
              <h1 className="text-xl font-bold">B3 MÓVEIS</h1>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar móveis..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => handleWhatsApp({ id: 0, nome: 'Catálogo', categoria: 'Geral', descricao: '', imagem_url: '' })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Contato
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow group">
                <div className="relative">
                  {product.imagem_url ? (
                    <Image
                      src={product.imagem_url}
                      alt={product.nome}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                      Sem imagem
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleWhatsApp(product)}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{product.nome}</h3>
                  <p className="text-blue-600 text-sm">{product.categoria}</p>
                  <p className="text-gray-600 text-sm">{product.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedProduct(null)} />
          <div className="bg-white rounded-lg max-w-2xl w-full relative">
            <div className="p-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedProduct?.nome}</h2>
              <p className="text-blue-600 mb-4">{selectedProduct?.categoria}</p>
              <p className="text-gray-600 mb-6">{selectedProduct?.descricao}</p>
              <button
                onClick={() => selectedProduct && handleWhatsApp(selectedProduct)}
                className="w-full bg-green-500 text-white py-3 rounded-lg"
              >
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => handleWhatsApp({ id: 0, nome: 'Atendimento', categoria: 'Geral', descricao: '', imagem_url: '' })}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  )
}
