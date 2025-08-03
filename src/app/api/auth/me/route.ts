import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}