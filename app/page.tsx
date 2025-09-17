'use client'

import { useState } from 'react'
import { Search, MessageCircle, Eye } from 'lucide-react'
import useSWR from 'swr'
import Image from 'next/image'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Product {
  id: number
  nome: string
  categoria: string
  tags: string
  imagem_url: string
  descricao: string
  status: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: products = [], isLoading } = useSWR('/api/products', fetcher)

  const handleWhatsApp = (product: Product) => {
    const message = `🏢 B3 Ambientes Corporativos\n\n📋 ${product.nome}\n📂 ${product.categoria}\n📝 ${product.descricao}\n\n💼 Solicitar orçamento!`
    const phoneNumber = '5581999999999'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // Filtrar produtos
  const filteredProducts = products.filter((product: Product) => {
    if (!product.nome || !product.categoria) return false
    
    const searchMatch = searchTerm === '' || 
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    
    const categoryMatch = selectedCategory === 'Todos' || product.categoria === selectedCategory
    
    return searchMatch && categoryMatch && product.status === 'Ativo'
  })

  // Categorias simples
  const allCategories = ['Todos', 'Cadeiras', 'Mesas', 'Estações', 'Armários', 'Acessórios']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B3</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">B3 MÓVEIS</h1>
                <p className="text-sm text-gray-600">Ambientes Corporativos</p>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar móveis..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => handleWhatsApp({ nome: 'Catálogo Geral', categoria: 'Geral', descricao: 'Catálogo completo', tags: '', imagem_url: '', status: 'Ativo', id: 0 })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contato</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Produtos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse">
                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: Product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <Image
                    src={product.imagem_url}
                    alt={product.nome}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleWhatsApp(product)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.nome}</h3>
                  <p className="text-sm font-medium text-blue-600 uppercase mb-2">{product.categoria}</p>
                  <p className="text-gray-600 text-sm">{product.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600">Tente ajustar sua busca.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedProduct(null)} />
            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-90vh overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3">
                  <Image
                    src={selectedProduct.imagem_url}
                    alt={selectedProduct.nome}
                    width={800}
                    height={600}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.nome}</h2>
                      <p className="text-blue-600 font-medium uppercase">{selectedProduct.categoria}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                    <p className="text-gray-600">{selectedProduct.descricao}</p>
                  </div>

                  <button
                    onClick={() => handleWhatsApp(selectedProduct)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Solicitar Orçamento</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Flutuante */}
      <button
        onClick={() => handleWhatsApp({ nome: 'Atendimento', categoria: 'Geral', descricao: 'Preciso de ajuda', tags: '', imagem_url: '', status: 'Ativo', id: 0 })}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  )
}
