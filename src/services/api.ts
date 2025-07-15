import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  // outros campos retornados pelo backend
}

export const loginFuncionario = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/Funcionario/login', credentials);
  return response.data;
};

export default api;
