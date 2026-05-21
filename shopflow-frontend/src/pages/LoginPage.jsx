import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authService';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Faz o login e salva o token
      await login(email, password);

      // Busca os dados do usuário e atualiza o contexto
      const { getMe } = await import('../api/authService');
      const userData = await getMe();
      handleLogin(userData);

      // Redireciona para a página inicial
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>Não tem conta? <Link to="/register">Cadastre-se</Link></p>
    </div>
  );
};

export default LoginPage;