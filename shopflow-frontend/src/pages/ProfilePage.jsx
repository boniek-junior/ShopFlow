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

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-8 shadow-sm text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white">
              {initials}
            </div>
          </div>

          {/* User Info */}
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {user.name}
          </h1>
          <p className="text-muted mb-8">{user.email}</p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full rounded-xl border-2 border-primary bg-transparent py-3 text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              Meus Pedidos
            </button>
            <button
              onClick={onLogout}
              className="w-full rounded-xl bg-destructive/10 py-3 text-base font-semibold text-destructive hover:bg-destructive/20 transition-colors"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
