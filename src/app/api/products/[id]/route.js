import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  const { id } = params

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: true,
        sale: true,
      },
    })

    if (product) {
      return NextResponse.json(product)
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}