import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { number } from 'zod';

//  Get /tasks get all endpoint
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [API] GET /tasks - Starting request...');

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

    // get listId query param
    const searchParams = request.nextUrl.searchParams;
    let listIdParam = searchParams.get('listId');
    if (listIdParam) {
      listIdParam = listIdParam.trim();
    }

    // Parse listId to number, returns NaN if fails
    const listId = Number(listIdParam);

    // validate required fields
    let tasks = undefined;
    if (!listId || typeof listId !== 'number' || listId <= 0) {
      // fetch all tasks
      console.log('🔄 [API] listId field not present or invalid!');
      console.log('🔄 [API] listId field: ', listId);
      console.log('🔄 [API] Fetching all tasks from database...');
      tasks = await prisma.task.findMany({
        orderBy: {
          priority: 'asc',
        },
      });
    } else {
      // fetch tasks by listId
      console.log('🔄 [API] listId field present!');
      console.log('🔄 [API] Fetching tasks by listId from database...');
      tasks = await prisma.task.findMany({
        where: {
          listId: listId,
        },
        orderBy: {
          priority: 'asc',
        },
      });
    }

    console.log(
      '✅ [API] Tasks fetched successfully:',
      tasks.length,
      'tasks found'
    );
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('🚩 [API] Error fetching tasks:', error);
    console.error('🚩 [API] Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [API] POST /tasks - Starting request...');

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

    const { listId, name, description, priority, status } = body;
    console.log('🔍 [API] Extracted fields:', {
      listId,
      name,
      description,
      priority,
      status,
    });

    // validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.error('🚩 [API] Validation failed: name is required');
      return NextResponse.json(
        { message: 'Task name is required' },
        { status: 400 }
      );
    }

    if (listId <= 0 || typeof listId !== 'number') {
      console.error('🚩 [API] Validation failed: listId is required');
      return NextResponse.json(
        { message: 'Task listId is required' },
        { status: 400 }
      );
    }

    // prepare data for database
    const taskData = {
      listId: listId,
      name: name.trim(),
      description:
        description && typeof description === 'string'
          ? description.trim()
          : '',
      priority: priority || 'medium',
      status: status || 'not-started',
      isComplete: false,
    };

    console.log('📋 [API] Data prepared for database:', taskData);

    // create new Task
    try {
      console.log('🔄 [API] Creating task in database...');
      const newTask = await prisma.task.create({
        data: taskData,
      });

      console.log('✅ [API] Task created successfully!');
      console.log('📨 [API] Created task:', newTask);

      return NextResponse.json(newTask, { status: 201 });
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
    console.error('🚩 [API] Unexpected error creating task:', error);
    console.error('🚩 [API] Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: 'Failed to create task' },
      { status: 500 }
    );
  }
}
