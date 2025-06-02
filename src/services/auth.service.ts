import { User } from '@/schemas/user';
import axiosApi from '@/api/axiosApi';
import axios from 'axios';

interface LoginResponse {
  user: User;
  token: string;
}

interface UserWithPassword extends User {
  password: string;
}

class AuthService {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    try {
      // Buscar usuário pelo email
      const response = await axiosApi.get<UserWithPassword[]>(`/users?email=${credentials.email}`);
      const users = response.data;

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];

      // Verificar senha (em um ambiente real, isso seria feito com hash)
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }

      // Gerar um token simples (em um ambiente real, use JWT)
      const token = btoa(JSON.stringify({ id: user.id, email: user.email }));

      return {
        user,
        token
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Login failed: ' + error.message);
      }
      throw error;
    }
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = JSON.parse(atob(token));
      const response = await axiosApi.get<User>(`/users/${decoded.id}`);
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
}

export default new AuthService(); 