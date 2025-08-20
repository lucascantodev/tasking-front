import { taskingApiClient } from '@/external/api/tasking';
import priorityEnum, { Priority } from '@/schemas/priority';
import statusEnum, { Status } from '@/schemas/status';
import { isAxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

    console.log('📋 [API] Data prepared for external api request:', listData);

    let updateListResponse: {
      id: number;
      name: string;
      description: string | null;
      priority: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    try {
      const response = await taskingApiClient.put(
        `/lists/${listId}`,
        listData,
        {
          headers: {
            Authorization: authorization,
          },
        }
      );

      updateListResponse = response.data;
    } catch (error) {
      console.error('Error updating list:', error);
      if (isAxiosError(error)) {
        console.error('Response data', error.response?.data);
      }

      throw error;
    }

    return NextResponse.json(updateListResponse, { status: 201 });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    console.log('🔄 [API] DELETE /lists/[listId] - Starting request...');

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

    try {
      await taskingApiClient.delete(`/lists/${listId}`, {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (error) {
      console.error('Error updating list:', error);
      if (isAxiosError(error)) {
        console.error('Response data', error.response?.data);
      }

      throw error;
    }

    return NextResponse.json(null, { status: 204 });
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
