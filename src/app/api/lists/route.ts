import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [API] GET /lists - Starting request...');

    // get token from authorization header
    const authorization = request.headers.get('Authorization');
    console.log(
      '🔍 [API] Authorization header:',
      authorization ? 'Present' : 'Missing'
    );

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.error('🚩 [API] Missing or invalid authorization header');
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    console.log('🔍 [API] Token extracted:', token.substring(0, 20) + '...');

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    console.log('✅ [API] Token verified for user:', decoded.userId);

    // fetch user's lists
    console.log('🔄 [API] Fetching lists from database...');
    const lists = await prisma.list.findMany({
      where: {
        owner: decoded.userId,
      },
      orderBy: {
        priority: 'asc',
      },
    });

    console.log(
      '✅ [API] Lists fetched successfully:',
      lists.length,
      'lists found'
    );
    return NextResponse.json(lists);
  } catch (error: any) {
    console.error('🚩 [API] Error fetching lists:', error);
    console.error('🚩 [API] Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: 'Failed to fetch lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [API] POST /lists - Starting request...');

    // get token from authorization header
    const authorization = request.headers.get('Authorization');
    console.log(
      '🔍 [API] Authorization header:',
      authorization ? 'Present' : 'Missing'
    );

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.error('🚩 [API] Missing or invalid authorization header');
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    console.log('🔍 [API] Token extracted:', token.substring(0, 20) + '...');

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      console.log('✅ [API] Token verified for user:', decoded.userId);
    } catch (jwtError: any) {
      console.error('🚩 [API] JWT verification failed:', jwtError.message);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // parse request body
    let body;
    try {
      body = await request.json();
      console.log('📥 [API] Request body received:', body);
    } catch (parseError: any) {
      console.error(
        '🚩 [API] Failed to parse request body:',
        parseError.message
      );
      return NextResponse.json(
        { message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { name, description, priority, status } = body;
    console.log('🔍 [API] Extracted fields:', {
      name,
      description,
      priority,
      status,
    });

    // validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.error('🚩 [API] Validation failed: name is required');
      return NextResponse.json(
        { message: 'List name is required' },
        { status: 400 }
      );
    }

    // prepare data for database
    const listData = {
      name: name.trim(),
      description:
        description && typeof description === 'string'
          ? description.trim()
          : '',
      priority: priority || 'medium',
      status: status || 'not-started',
      owner: decoded.userId,
    };

    console.log('📋 [API] Data prepared for database:', listData);

    // create new list
    try {
      console.log('🔄 [API] Creating list in database...');
      const newList = await prisma.list.create({
        data: listData,
      });

      console.log('✅ [API] List created successfully!');
      console.log('📨 [API] Created list:', newList);

      return NextResponse.json(newList, { status: 201 });
    } catch (dbError: any) {
      console.error('🚩 [API] Database error:', dbError);
      console.error('🚩 [API] Database error details:', {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta,
      });

      return NextResponse.json(
        { message: 'Database error occurred' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('🚩 [API] Unexpected error creating list:', error);
    console.error('🚩 [API] Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: 'Failed to create list' },
      { status: 500 }
    );
  }
}
