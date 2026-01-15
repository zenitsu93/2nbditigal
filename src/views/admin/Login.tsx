import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button, TextInput, Card } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';
import FullLogo from '../../layouts/full/shared/logo/FullLogo';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FullLogo />
          </div>
          <h1 className="text-3xl font-bold text-dark">Connexion Admin</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <Icon icon="solar:danger-circle-line-duotone" className="text-lg" />
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-dark mb-2">
              Nom d'utilisateur
            </label>
            <TextInput
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              required
              icon={() => <Icon icon="solar:user-line-duotone" />}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
              Mot de passe
            </label>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
              icon={() => <Icon icon="solar:lock-password-line-duotone" />}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icon icon="solar:refresh-line-duotone" className="animate-spin mr-2" />
                Connexion...
              </>
            ) : (
              <>
                <Icon icon="solar:login-3-line-duotone" className="mr-2" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
          >
            <Icon icon="solar:arrow-left-line-duotone" />
            Retour au site
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
