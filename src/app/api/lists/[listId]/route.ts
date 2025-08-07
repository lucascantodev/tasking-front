import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import priorityEnum, { Priority } from '@/schemas/priority';
import statusEnum, { Status } from '@/schemas/status';

export async function PUT(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    console.log('🔄 [API] PUT /lists/[listId] - Starting request...');

    // get token from authorization header
    const authorization = request.headers.get('Authorization');
    console.log(
      '🔍 [API] Authorization header:',
      authorization ? 'Present' : 'Missing'
    );

    if (!authorization || !authorization.startsWith('Bearer')) {
      console.error('🚩 [API] Missing or invalid authorization header');
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    console.log('🔍 [API] Token extracted:', token.substring(0, 20) + '...');

    // Verify token
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

    // Validate listId para
    const listId = Number(params.listId);
    console.log(`🔍 [API] From url path got this listId: ${listId}`);
    if (!listId || typeof listId !== 'number' || listId <= 0) {
      console.error(
        '🚩 [API] Validation failed: listId param in url path is missing or wrong'
      );
      return NextResponse.json(
        { message: 'List listId param in url path is missing or wrong' },
        { status: 400 }
      );
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

    const validateName = (name: string) =>
      name && typeof name === 'string' && name.trim().length > 0;

    const validateDesc = (description: string) =>
      description &&
      typeof description === 'string' &&
      description.trim().length > 0;

    const validatePriority = (priority: Priority) =>
      priorityEnum.safeParse(priority).success;

    const validateStatus = (status: Status) =>
      statusEnum.safeParse(status).success;

    // Validate fields for update
    let listData: {
      name?: string;
      description?: string;
      priority?: Priority;
      status?: Status;
    } = {};
    if (validateName(name)) {
      console.log('🔄 [API] List name validated, adding for update');
      listData.name = name.trim();
    }
    if (validateDesc(description)) {
      console.log('🔄 [API] List description validated, adding for update');
      listData.description = description.trim();
    }
    if (validatePriority(priority)) {
      console.log('🔄 [API] List priority validated, adding for update');
      listData.priority = priority;
    }
    if (validateStatus(status)) {
      console.log('🔄 [API] List status validated, adding for update');
      listData.status = status;
    }

    // Validate at least one field was added
    if (Object.keys(listData).length <= 0) {
      console.error('🚩 [API] Error: No valid or informated fields for update');
      return NextResponse.json(
        { message: 'No valid or informated fields for update' },
        { status: 400 }
      );
    }

    console.log('📋 [API] Data prepared for database:', listData);

    // create new list
    try {
      console.log('🔄 [API] Creating list in database...');
      const newList = await prisma.list.update({
        data: listData,
        where: {
          id: listId,
        },
      });

      console.log('✅ [API] List updated successfully!');
      console.log('📨 [API] Updated list:', newList);

      return NextResponse.json(newList, { status: 200 });
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
    console.error('🚩 [API] Unexpected error updating list:', error);
    console.error('🚩 [API] Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: 'Failed to update list' },
      { status: 500 }
    );
  }
}
