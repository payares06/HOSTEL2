import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Settings, Eye, EyeOff, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, register, loading, error } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
      }
      onNavigate('inicio');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError('');
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: ''
    });
    setFormError('');
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  const handleAdminLogin = async () => {
    try {
      await login('admin@hotelelegance.com', 'admin123456');
      onNavigate('inicio');
    } catch (err: any) {
      setFormError(err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Accede a tu cuenta para continuar' 
              : 'Regístrate para hacer reservas'
            }
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="h-5 w-5" />
              <span>Registrarse</span>
            </button>
          </div>

          {mode === 'login' && (
            <div className="mb-6 p-4 rounded-lg border-2 bg-green-50 border-green-200">
              <h3 className="font-semibold mb-2 text-green-900">
                Acceso de Administrador:
              </h3>
              <button
                onClick={handleAdminLogin}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Iniciando...' : 'Entrar como Admin'}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {(formError || error) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{formError || error}</p>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu número de teléfono"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading 
                ? (mode === 'login' ? 'Iniciando...' : 'Registrando...') 
                : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('inicio')}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>

        {/* Features Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {mode === 'login' ? 'Con tu cuenta puedes:' : 'Al registrarte podrás:'}
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Realizar reservas de habitaciones</li>
            <li>• Ver el historial de tus reservas</li>
            <li>• Cancelar reservas cuando sea necesario</li>
            <li>• Recibir confirmaciones por email</li>
            <li>• Acceder a ofertas especiales</li>
          </ul>
        </div>
      </div>
    </div>
  );
}