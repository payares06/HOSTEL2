import React from 'react';
import { TreePine, Users, Bed, Calendar, Camera, Phone, LogIn, User, Settings } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const siteMap = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: TreePine,
      description: 'Página principal con mapa del sitio',
      children: [
        { id: 'nosotros', label: 'Nosotros', icon: Users, description: 'Historia y misión del hotel' },
        {
          id: 'habitaciones',
          label: 'Habitaciones',
          icon: Bed,
          description: 'Catálogo de habitaciones disponibles',
          children: [
            { id: 'individual', label: 'Habitación Individual', description: 'Para un huésped' },
            { id: 'doble', label: 'Habitación Doble', description: 'Para dos huéspedes' },
            { id: 'familiar', label: 'Habitación Familiar', description: 'Para familias' }
          ]
        },
        { id: 'reservas', label: 'Reservas', icon: Calendar, description: 'Sistema de reservas en línea' },
        { id: 'galeria', label: 'Galería', icon: Camera, description: 'Fotos del hotel e instalaciones' },
        { id: 'contacto', label: 'Contacto', icon: Phone, description: 'Información de contacto' },
        {
          id: 'login',
          label: 'Iniciar Sesión',
          icon: LogIn,
          description: 'Acceso al sistema',
          children: [
            { id: 'cliente', label: 'Cliente', icon: User, description: 'Acceso para huéspedes' },
            { id: 'admin', label: 'Administrador', icon: Settings, description: 'Panel de administración' }
          ]
        }
      ]
    }
  ];

  const renderSiteMapItem = (item: any, level = 0) => {
    const Icon = item.icon;
    const isClickable = ['nosotros', 'habitaciones', 'reservas', 'galeria', 'contacto', 'login'].includes(item.id);
    
    return (
      <div key={item.id} className={`mb-4 ${level > 0 ? 'ml-8' : ''}`}>
        <div 
          className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 ${
            isClickable 
              ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transform hover:scale-105' 
              : 'border-gray-200 bg-gray-50'
          }`}
          onClick={() => isClickable && onNavigate(item.id)}
        >
          {Icon && <Icon className={`h-6 w-6 ${isClickable ? 'text-blue-600' : 'text-gray-600'} flex-shrink-0 mt-1`} />}
          <div className="flex-grow">
            <h3 className={`text-lg font-semibold ${isClickable ? 'text-blue-900' : 'text-gray-900'}`}>
              {item.label}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
          </div>
        </div>
        
        {item.children && (
          <div className="mt-3">
            {item.children.map((child: any) => renderSiteMapItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Bienvenido a Hotel Elegance</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Descubre la comodidad y elegancia en cada rincón de nuestro hotel. 
            Explora nuestro sitio web y conoce todo lo que tenemos para ofrecerte.
          </p>
        </div>
      </div>

      {/* Site Map Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Mapa de Navegación del Sitio</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explora la estructura completa de nuestro sitio web. Haz clic en cualquier sección para navegar directamente.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {siteMap.map(item => renderSiteMapItem(item))}
        </div>

        {/* How it Works Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              Para Huéspedes (Clientes)
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Explora habitaciones:</strong> Navega por nuestro catálogo de habitaciones individuales, dobles y familiares.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Realiza reservas:</strong> Completa el formulario de reserva con tus datos y fechas preferidas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Inicia sesión:</strong> Accede como cliente para ver el estado de tus reservas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Galería y contacto:</strong> Explora nuestras instalaciones y contacta con nosotros.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="h-8 w-8 text-green-600 mr-3" />
              Para Administradores
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Panel de control:</strong> Acceso completo al sistema de gestión del hotel.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Gestión de reservas:</strong> Ve, confirma, cancela y modifica reservas de huéspedes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Control de habitaciones:</strong> Gestiona disponibilidad y precios de habitaciones.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p><strong>Reportes:</strong> Accede a estadísticas y reportes de ocupación y ingresos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}