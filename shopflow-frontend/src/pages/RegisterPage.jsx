import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../api/authService';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
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
      // Cadastra o usuário
      await register(name, email, password);

      // Faz login automaticamente após o cadastro
      await login(email, password);

      // Busca os dados do usuário e atualiza o contexto
      const { getMe } = await import('../api/authService');
      const userData = await getMe();
      handleLogin(userData);

      // Redireciona para a página inicial
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p>Já tem conta? <Link to="/login">Entre aqui</Link></p>
    </div>
  );
};

export default RegisterPage;