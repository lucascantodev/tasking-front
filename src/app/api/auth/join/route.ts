// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [API] POST /auth/join - Starting request...');

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Validate fields
    if (typeof name !== 'string' || name.trim().length <= 0) {
      console.error('🚩 [API] Invalid name param passed: ', name);
      return NextResponse.json(
        { message: 'Invalid name in body request.' },
        { status: 401 }
      );
    }

    if (typeof email !== 'string' || email.trim().length <= 0) {
      console.error('🚩 [API] Invalid email param passed: ', email);
      return NextResponse.json(
        { message: 'Invalid email in body request.' },
        { status: 401 }
      );
    }

    if (typeof password !== 'string' || password.trim().length <= 0) {
      console.error('🚩 [API] Invalid password param passed');
      return NextResponse.json(
        { message: 'Invalid password in body request.' },
        { status: 401 }
      );
    }

    // Verifying if already exist a user with that email
    const prevUser = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (prevUser) {
      console.error(
        '🚩 [API] User with informed email already exists, email: ',
        email.trim()
      );
      return NextResponse.json(
        {
          message:
            'User with informed email already exists, email: ' + email.trim(),
        },
        { status: 409 }
      );
    }

    // create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      },
    });

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
    const response = NextResponse.json(
      {
        user: { ...user, updatedAt: user.createdAt.toISOString() },
        accessToken,
      },
      { status: 201 }
    );

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
