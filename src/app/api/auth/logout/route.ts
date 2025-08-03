import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Logged out successfully' 
    });

    // clear refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}