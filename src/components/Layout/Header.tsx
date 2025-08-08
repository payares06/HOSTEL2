import React from 'react';
import { Hotel, User, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { currentUser, setCurrentUser } = useApp();

  const handleLogout = () => {
    setCurrentUser(null);
    onNavigate('inicio');
  };

  const navigationItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'habitaciones', label: 'Habitaciones' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'galeria', label: 'Galería' },
    { id: 'contacto', label: 'Contacto' }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('inicio')}
          >
            <Hotel className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Hotel Elegance</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {currentUser.fullName} ({currentUser.role === 'admin' ? 'Admin' : 'Cliente'})
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    onNavigate('inicio');
                  }}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}