import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

async function isAuthenticated(request) {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function PUT(request, { params }) {
    if (!await isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    try {
        const { id } = params;
        const { name, description, price, quantity, images, sale } = await request.json();
        if (!name || !price || isNaN(price) || !quantity || isNaN(quantity)) {
        return NextResponse.json({ error: 'Invalid product data. Please check all required fields.' }, { status: 400 });
        }

        // First, check if the product has an existing sale
        const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { sale: true }
        });

        let saleData;
        if (sale && (sale.startDate || sale.endDate || sale.discount)) {
        saleData = {
            upsert: {
            create: {
                startDate: new Date(sale.startDate),
                endDate: new Date(sale.endDate),
                discount: parseFloat(sale.discount),
            },
            update: {
                startDate: new Date(sale.startDate),
                endDate: new Date(sale.endDate),
                discount: parseFloat(sale.discount),
            },
            },
        };
        } else if (existingProduct.sale) {
        // If there's an existing sale but the new data doesn't include a sale, delete it
        saleData = { delete: true };
        }

        const updatedItem = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
            name,
            description,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            images: {
            deleteMany: {},
            create: images.map((image, index) => ({
                url: image.url,
                order: index,
            })),
            },
            sale: saleData,
        },
        include: {
            images: { orderBy: { order: 'asc' } },
            sale: true,
        },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        return NextResponse.json({ error: `Error updating inventory item: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }
  try {
    const { id } = params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing inventory item:', error);
    return NextResponse.json({ error: `Error removing inventory item: ${error.message}` }, { status: 500 });
  }
}
