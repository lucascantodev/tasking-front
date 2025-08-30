import axios from 'axios';

class SecureTokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
    this.refreshToken = null;
    this.refreshPromise = null;
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  // refresh with single promise (prevents multiple simultaneous calls)
  async refreshAccessToken(): Promise<string | null> {
    // if there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // create new refresh promise
    this.refreshPromise = this.performRefresh();

    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null; // clear promise
      return newToken;
    } catch (error) {
      this.refreshPromise = null; // clear promise even on error
      throw error;
    }
  }

  private async performRefresh(): Promise<string | null> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/token/refresh/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.access);
        console.log('✅ Token refreshed successfully');
        return data.access;
      }

      console.log('❌ Refresh failed - invalid refresh token');
      this.clearAccessToken();
      return null;
    } catch (error) {
      console.error('❌ Refresh request failed:', error);
      this.clearAccessToken();
      return null;
    }
  }

  // checks if token is about to expire
  isTokenExpiring(): boolean {
    if (!this.accessToken) return false;

    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      const exp = payload.exp;

      // if expires in less than 2 minutes, consider it "expiring"
      return exp - now < 120;
    } catch {
      return false;
    }
  }
}

const tokenManager = new SecureTokenManager();

const axiosApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor - adds token and preventive refresh
axiosApi.interceptors.request.use(async (config) => {
  let token = tokenManager.getAccessToken();

  // if token is expiring, try preventive refresh
  if (token && tokenManager.isTokenExpiring()) {
    console.log('🔄 Token expiring soon, refreshing preventively...');
    const newToken = await tokenManager.refreshAccessToken();
    token = newToken || token;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// response interceptor - reactive refresh
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if 401 error and hasn't tried refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 401 error, attempting token refresh...');
        const newToken = await tokenManager.refreshAccessToken();

        if (newToken) {
          console.log('✅ Token refreshed, retrying original request');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosApi(originalRequest);
        } else {
          console.log('❌ Refresh failed, redirecting to login');
          tokenManager.clearAccessToken();

          if (typeof window !== 'undefined') {
            // redirect preserving current URL
            const currentPath = window.location.pathname;
            window.location.href = `/?returnUrl=${encodeURIComponent(currentPath)}`;
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        tokenManager.clearAccessToken();

        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// utility functions
export const setAccessToken = (accessToken: string) => {
  tokenManager.setAccessToken(accessToken);
};

export const setAuthToken = (accessToken: string, refreshToken: string) => {
  tokenManager.setAccessToken(accessToken);
  tokenManager.setRefreshToken(refreshToken);
};

export const clearAuthToken = async () => {
  try {
    tokenManager.clearAccessToken();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/token/logout/`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const isAuthenticated = (): boolean => {
  return tokenManager.getAccessToken() !== null;
};

export const getCurrentToken = (): string | null => {
  return tokenManager.getAccessToken();
};

export const getRefreshToken = (): string | null => {
  return tokenManager.getRefreshToken();
};

export default axiosApi;
