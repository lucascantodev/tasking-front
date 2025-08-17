import { taskingApiClient } from '@/external/api/tasking';
import { isAxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

    let findMeResponse: {
      id: number;
      first_name: string;
      email: string;
      date_joined: string;
    };
    try {
      const response = await taskingApiClient.get('/users/me', {
        headers: {
          Authorization: authHeader,
        },
      });

      findMeResponse = response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 404: {
            return NextResponse.json(
              { message: 'User not found' },
              { status: 404 }
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

    return NextResponse.json({
      id: findMeResponse.id,
      name: findMeResponse.first_name,
      email: findMeResponse.email,
      createdAt: findMeResponse.date_joined,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
