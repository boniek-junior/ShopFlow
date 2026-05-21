import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div>
      <h1>Meu Perfil</h1>

      {/* Dados do usuário */}
      <div>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Ações */}
      <div>
        <button onClick={() => navigate('/orders')}>
          Meus pedidos
        </button>
        <button onClick={onLogout}>
          Sair
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;