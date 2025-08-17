// src/app/api/auth/login/route.ts
import { taskingApiClient } from '@/external/api/tasking';
import { isAxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    let loginResponse: {
      access: string;
      refresh: string;
    };
    try {
      const response = await taskingApiClient.post('/api/token', {
        username: email,
        password,
      });

      loginResponse = response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 401: {
            return NextResponse.json(
              { message: 'Invalid credentials' },
              { status: 401 }
            );
          }
          default: {
            return NextResponse.json(
              { message: 'Internal server error' },
              { status: 500 }
            );
          }
        }
      }

      throw error;
    }

    // prepare response
    const response = NextResponse.json({
      accessToken: loginResponse.access,
    });

    // set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', loginResponse.refresh, {
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
