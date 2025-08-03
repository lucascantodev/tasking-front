import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      );
    }

    // verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!
    ) as any;

    if (decoded.type !== 'refresh') {
      return NextResponse.json(
        { message: 'Invalid token type' },
        { status: 401 }
      );
    }

    // find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 401 }
      );
    }

    // generate new access token
    const newAccessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    return NextResponse.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { message: 'Invalid refresh token' },
      { status: 401 }
    );
  }
}