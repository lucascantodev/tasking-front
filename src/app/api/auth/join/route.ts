// src/app/api/auth/login/route.ts
import { taskingApiClient } from '@/external/api/tasking';
import { isAxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

    let registerResponse: {
      id: number;
      first_name: string;
      email: string;
      date_joined: string;
    };
    try {
      const response = await taskingApiClient.post('/api/register', {
        first_name: name,
        email,
        password,
      });

      registerResponse = response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 400: {
            return NextResponse.json(
              { message: 'User already exists' },
              { status: 400 }
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
    const response = NextResponse.json(
      {
        user: {
          id: registerResponse.id,
          email: registerResponse.email,
          name: registerResponse.first_name,
          createdAt: registerResponse.date_joined,
        },
        accessToken: loginResponse.access,
      },
      { status: 201 }
    );

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
