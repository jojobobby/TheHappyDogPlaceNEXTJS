import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

async function isAuthenticated(request) {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function GET(request) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }
  try {
    const items = await prisma.product.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
        sale: true,
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json({ error: `Error fetching inventory items: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const quantity = parseInt(formData.get('quantity'));
    const saleStartDate = formData.get('sale.startDate');
    const saleEndDate = formData.get('sale.endDate');
    const saleDiscount = parseFloat(formData.get('sale.discount'));

    if (!name || !price || isNaN(price) || !quantity || isNaN(quantity)) {
      return NextResponse.json({ error: 'Invalid product data. Please check all required fields.' }, { status: 400 });
    }

    const images = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error('Error creating upload directory:', err);
        return NextResponse.json({ error: `Error creating upload directory: ${err.message}` }, { status: 500 });
      }
    }

    for (let i = 0; formData.get(`image${i}`); i++) {
      const file = formData.get(`image${i}`);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      images.push({ url: `/uploads/${fileName}`, order: i });
    }

    const newItem = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        images: {
          create: images,
        },
        sale: saleStartDate && saleEndDate && saleDiscount ? {
          create: {
            startDate: new Date(saleStartDate),
            endDate: new Date(saleEndDate),
            discount: saleDiscount,
          },
        } : undefined,
      },
      include: {
        images: true,
        sale: true,
      },
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return NextResponse.json({ error: `Error adding inventory item: ${error.message}` }, { status: 500 });
  }
}