import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout as logoutService, isAuthenticated } from '../api/authService';

// Contexto de autenticação — compartilha o estado do usuário em toda a aplicação
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar a aplicação, verifica se o usuário já está autenticado
  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch {
          // Token inválido ou expirado — limpa o estado
          logoutService();
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Atualiza o estado do usuário após o login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Limpa o estado do usuário após o logout
  const handleLogout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      handleLogin,
      handleLogout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para acessar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};