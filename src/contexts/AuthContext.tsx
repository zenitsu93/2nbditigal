import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, Admin } from '../services/api/auth';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe dans le localStorage
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      // Vérifier la validité du token
      authApi.verify(storedToken)
        .then((response) => {
          if (response.valid && response.admin) {
            setToken(storedToken);
            setAdmin(response.admin);
          } else {
            // Token invalide, nettoyer
            localStorage.removeItem('auth_token');
            setToken(null);
            setAdmin(null);
          }
        })
        .catch(() => {
          // Erreur de vérification, nettoyer
          localStorage.removeItem('auth_token');
          setToken(null);
          setAdmin(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      localStorage.setItem('auth_token', response.token);
      setToken(response.token);
      setAdmin(response.admin);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, password: string, email?: string) => {
    try {
      const response = await authApi.register(username, password, email);
      localStorage.setItem('auth_token', response.token);
      setToken(response.token);
      setAdmin(response.admin);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setAdmin(null);
  };

  const value: AuthContextType = {
    admin,
    token,
    isAuthenticated: !!token && !!admin,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
