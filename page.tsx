'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Phone, MessageCircle, Eye, Grid, List } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: products = [], isLoading, error } = useSWR('/api/products', fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: false,
  })

  const categories = useMemo(() => {
    const cats = ['Todos', ...new Set(products.map((p: Product) => p.categoria))]
    return cats.map(cat => ({
      name: cat,
      count: cat === 'Todos' ? products.length : products.filter((p: Product) => p.categoria === cat).length
    }))
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory
      return matchesSearch && matchesCategory && product.status === 'Ativo'
    })
  }, [products, searchTerm, selectedCategory])

  const handleWhatsApp = (product: Product) => {
    const message = `🏢 *B3 Ambientes Corporativos*\n\n📋 *${product.nome}*\n📂 Categoria: ${product.categoria}\n📝 ${product.descricao}\n\n🔗 Ver catálogo: ${window.location.origin}\n\n💼 Gostaria de solicitar orçamento personalizado!`
    const phoneNumber = '5581999999999'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar produtos</h2>
          <p className="text-gray-600">Tente recarregar a página</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-50 glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-b3-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B3</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">B3 MÓVEIS</h1>
                <p className="text-xs text-gray-600">Ambientes Corporativos</p>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar móveis: cadeira executive, mesa reunião..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-b3-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => handleWhatsApp({ nome: 'Catálogo Geral', categoria: 'Geral', descricao: 'Interesse no catálogo completo', tags: '', imagem_url: '', status: 'Ativo', id: 0 })}
              className="bg-b3-blue-500 hover:bg-b3-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contato Vendedor</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-b3-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <div className="flex rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${viewMode === 'grid' ? 'bg-b3-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${viewMode === 'list' ? 'bg-b3-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {filteredProducts.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover group"
              >
                <div className="relative">
                  <Image
                    src={product.imagem_url}
                    alt={product.nome}
                    width={400}
                    height={300}
                    className={`w-full object-cover ${viewMode === 'grid' ? 'h-48' : 'h-64'}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleWhatsApp(product)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-b3-blue-500 hover:bg-b3-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-b3-blue-600 transition-colors">
                      {product.nome}
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-b3-blue-600 uppercase tracking-wide mb-2">
                    {product.categoria}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600">
                Tente ajustar sua busca ou filtros para encontrar o que procura.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedProduct(null)} />
            <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3">
                  <Image
                    src={selectedProduct.imagem_url}
                    alt={selectedProduct.nome}
                    width={800}
                    height={600}
                    className="w-full h-64 lg:h-full object-cover"
