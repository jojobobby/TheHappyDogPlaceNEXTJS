import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Your existing logic to fetch dashboard stats
    let stats = await prisma.dashboardStats.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!stats || stats.updatedAt < new Date(Date.now() - 3600000)) {
      const totalProducts = await prisma.product.count();
      const totalOrders = await prisma.order.count();
      const totalRevenue = await prisma.order.aggregate({
        _sum: { total: true },
      });

      stats = await prisma.dashboardStats.create({
        data: {
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue._sum.total || 0,
        },
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}