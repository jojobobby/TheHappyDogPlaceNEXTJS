// app/api/products/route.js

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')

  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        sale: true,
      },
      ...(limit && { take: parseInt(limit) })
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
