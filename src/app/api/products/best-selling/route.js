// app/api/products/best-selling/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bestSellingProducts = await prisma.product.findMany({
      orderBy: [
        { purchaseCount: 'desc' },
        { name: 'asc' } // As a tiebreaker for products with no purchases
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
    return NextResponse.json(bestSellingProducts);
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    return NextResponse.json({ error: 'Error fetching best selling products' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
