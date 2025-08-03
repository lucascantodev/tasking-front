import { UserSchema_Type } from '@/schemas/user';
import axiosApi, {
  clearAuthToken,
  getCurrentToken,
  setAuthToken,
} from '@/api/axiosApi';
import axios from 'axios';

interface LoginResponse {
  user: UserSchema_Type;
  accessToken: string;
}

class AuthService {
  private readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/`;

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_URL}auth/login`, {
        method: 'POST',
        credentials: 'include', // includes HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data: LoginResponse = await response.json();

      setAuthToken(data.accessToken);

      const user = data.user;

      console.log(
        `✅ Login successful, token stored in memory: \n ${data.accessToken}`
      );
      console.log('User data:', data.user);

      return data;
    } catch (error) {
      console.error(`🚩 Login failed: \n${error}`);
      throw new Error('🚩 Login failed: ' + (error as Error).message);
    }
  }

  async logout(): Promise<void> {
    try {
      await clearAuthToken();
      console.log('✅ Logout successful, token cleared from memory');
    } catch (error) {
      console.error(`🚩 Logout failed: \n${error}`);
      throw new Error('🚩 Logout failed: ' + (error as Error).message);
    }
  }

  async validateToken(): Promise<UserSchema_Type | null> {
    try {
      const token = getCurrentToken();

      if (!token) {
        console.log('🚩 No token available for validation');
        return null;
      }

      const response = await fetch(`${this.API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // includes HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('🚩 Unauthorized: Invalid or expired token');
          return null;
        }
        return null;
      }

      const user: UserSchema_Type = await response.json();
      return user;
    } catch (error) {
      console.error('🚩 Token validation failed: \n', error);
      return null;
    }
  }

  // method to manually refresh the token (if needed)
  async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      // update the token in memory
      setAuthToken(data.accessToken);

      return data.accessToken;
    } catch (error) {
      console.error('🚩 Manual refresh failed:', error);
      return null;
    }
  }
}

export default new AuthService();
