// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // validate password (in production, use bcrypt)
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // generate tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: 'refresh',
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // prepare response
    const response = NextResponse.json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.createdAt.toISOString(), // using createdAt as updatedAt for now
      },
      accessToken,
    });

    // set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
