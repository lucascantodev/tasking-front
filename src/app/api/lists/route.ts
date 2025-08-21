import { taskingApiClient } from '@/external/api/tasking';
import { isAxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

    let listListsResponse: Array<{
      id: number;
      name: string;
      description: string | null;
      priority: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>;
    try {
      const response = await taskingApiClient.get('/lists', {
        headers: {
          Authorization: authorization,
        },
      });

      listListsResponse = response.data;
    } catch (error) {
      console.error('Error fetching lists:', error);
      if (isAxiosError(error)) {
        console.error('Response data', error.response?.data);
      }

      throw error;
    }

    console.log(
      '✅ [API] Lists fetched successfully:',
      listListsResponse.length,
      'lists found'
    );
    return NextResponse.json(listListsResponse);
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

    // prepare data for external api request
    const listData = {
      name: name.trim(),
      description:
        description && typeof description === 'string'
          ? description.trim()
          : '',
      priority: priority || 'medium',
      status: status || 'not-started',
    };

    console.log('📋 [API] Data prepared for external api request:', listData);

    let createListResponse: {
      id: number;
      name: string;
      description: string | null;
      priority: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    try {
      const response = await taskingApiClient.post('/lists', listData, {
        headers: {
          Authorization: authorization,
        },
      });

      createListResponse = response.data;
    } catch (error) {
      console.error('Error creating list:', error);
      if (isAxiosError(error)) {
        console.error('Response data', error.response?.data);
      }

      throw error;
    }

    return NextResponse.json(createListResponse, { status: 201 });
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
