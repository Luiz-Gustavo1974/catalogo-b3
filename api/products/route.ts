import { NextResponse } from 'next/server'

const SHEET_ID = '1LN_9TUdI_mzvLMqtNyDaLaCkcClaPvdDTl_a0mZK998'
const SHEET_NAME = 'Sheet1'

export async function GET() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    
    const text = await response.text()
    const jsonText = text.substring(47).slice(0, -2)
    const data = JSON.parse(jsonText)
    
    const products = data.table.rows.slice(1).map((row: any, index: number) => ({
      id: row.c[0]?.v || index + 1,
      nome: row.c[1]?.v || '',
      categoria: row.c[2]?.v || '',
      tags: row.c[3]?.v || '',
      imagem_url: row.c[4]?.v || '',
      descricao: row.c[5]?.v || '',
      status: row.c[6]?.v || 'Ativo',
      data_criacao: row.c[7]?.v || '',
      drive_file_id: row.c[8]?.v || '',
    })).filter((product: any) => product.nome && product.imagem_url)
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
