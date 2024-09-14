import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
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
        const saleStartDate = formData.get('saleStartDate');
        const saleEndDate = formData.get('saleEndDate');
        const saleDiscount = parseFloat(formData.get('saleDiscount'));

        if (!name || !price || isNaN(price) || !quantity || isNaN(quantity)) {
        return NextResponse.json({ error: 'Invalid product data. Please check all required fields.' }, { status: 400 });
        }

        const images = [];
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        
        // Create the upload directory if it doesn't exist
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

export async function PUT(request) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }
  try {
    const { id, name, description, price, quantity, images, sale } = await request.json();
    if (!id || !name || !price || isNaN(price) || !quantity || isNaN(quantity)) {
      return NextResponse.json({ error: 'Invalid product data. Please check all required fields.' }, { status: 400 });
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
        sale: sale ? {
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
        } : { delete: true },
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

export async function DELETE(request) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
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
