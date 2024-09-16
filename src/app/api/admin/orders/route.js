import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');

  try {
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where })
    ]);

    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price
      })),
      shippingDetails: order.shippingDetails,
      paymentDetails: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        transactionId: order.paymentTransactionId
      }
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
