import {
  clearAuthToken,
  getCurrentToken,
  setAccessToken,
  setAuthToken,
} from '@/axiosApi';
import { UserSchema_Type } from '@/schemas/user';


interface LoginResponse {
  user: UserSchema_Type;
  access: string;
  refresh: string;
}

interface JoinResponse {
  user: UserSchema_Type;
  access: string;
  refresh: string;
}

class AuthService {
  private readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/`;

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const { email, password } = credentials;

      const response = await fetch(`${this.API_URL}token/`, {
        method: 'POST',
        credentials: 'include', // includes HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "username": email, "password": password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data: LoginResponse = await response.json();

      setAuthToken(data.access, data.refresh);

      console.log(
        `✅ Login successful, token stored in memory: \n ${data.access}`
      );
      console.log('User data:', data.user);

      return data;
    } catch (error) {
      console.error(`🚩 Login failed: \n${error}`);
      throw new Error('🚩 Login failed: ' + (error as Error).message);
    }
  }

  async join(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<JoinResponse> {
    try {
      // Replace name with username that should be the same as email. 
      // example: name: dot@gmail.com, username: dot@gmail.com, email: dot@gmail.com
      const { email: username, email, password } = userData;

      const response = await fetch(`${this.API_URL}register/`, {
        method: 'POST',
        credentials: 'include', // includes HttpOnly cookies (not needed, but leave it there)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid user data');
      }

      const data: JoinResponse = await response.json();

      setAuthToken(data.access, data.refresh);

      console.log(
        `✅ [AuthService] Join successful, token stored in memory: \n ${data.access}`
      );
      console.log('User data:', data.user);

      return data;
    } catch (error) {
      console.error(`🚩 Join failed: \n${error}`);
      throw new Error('🚩 Join failed: ' + (error as Error).message);
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
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/`;
      let token = getCurrentToken();

      if (!token) {
        console.log('🚩 No token available for validation, trying to refresh');

        const newAccessToken = await this.refreshToken();

        if (!newAccessToken) {
          console.log('🚩 Token refresh failed');
          return null;
        }

        token = newAccessToken;
      }

      const response = await fetch(`${apiUrl}users/me/`, {
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
      const response = await fetch(`${this.API_URL}token/refresh/`, {
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
      setAccessToken(data.access);

      return data.access;
    } catch (error) {
      console.error('🚩 Manual refresh failed:', error);
      return null;
    }
  }
}

export default new AuthService();
