import { taskingApiClient } from '@/external/api/tasking';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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

    let refreshResponse: {
      access: string;
    };
    try {
      const response = await taskingApiClient.post('/api/token/refresh', {
        refresh: refreshToken,
      });

      refreshResponse = response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 401: {
            return NextResponse.json(
              { message: 'Invalid refresh token' },
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

    return NextResponse.json({
      accessToken: refreshResponse.access,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { message: 'Invalid refresh token' },
      { status: 401 }
    );
  }
}
