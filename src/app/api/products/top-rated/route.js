// app/api/products/top-rated/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const topRatedProducts = await prisma.product.findMany({
      orderBy: [
        { rating: 'desc' },
        { ratingCount: 'desc' },
        { name: 'asc' } // As a tiebreaker for products with no ratings
      ],
      take: 4,
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        sale: true,
      }
    });
    return NextResponse.json(topRatedProducts);
  } catch (error) {
    console.error('Error fetching top rated products:', error);
    return NextResponse.json({ error: 'Error fetching top rated products' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
