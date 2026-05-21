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

      // Busca os dados do usuario e atualiza o contexto
      const { getMe } = await import('../api/authService');
      const userData = await getMe();
      handleLogin(userData);

      // Redireciona para a pagina inicial
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-lg shadow-black/5 p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block text-3xl font-bold text-primary">
              ShopFlow
            </Link>
            <h1 className="mt-4 text-2xl font-semibold text-foreground">
              Bom te ver novamente
            </h1>
            <p className="mt-2 text-muted">
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-muted">
            Nao tem uma conta?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
