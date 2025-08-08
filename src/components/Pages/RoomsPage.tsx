import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Wifi, Tv, Coffee, Wind, Bath, Home, Eye } from 'lucide-react';

interface RoomsPageProps {
  onNavigate: (page: string) => void;
}

export function RoomsPage({ onNavigate }: RoomsPageProps) {
  const { rooms } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const getIconForFeature = (feature: string) => {
    if (feature.includes('WiFi')) return <Wifi className="h-4 w-4" />;
    if (feature.includes('TV')) return <Tv className="h-4 w-4" />;
    if (feature.includes('Minibar')) return <Coffee className="h-4 w-4" />;
    if (feature.includes('Aire')) return <Wind className="h-4 w-4" />;
    if (feature.includes('Baño')) return <Bath className="h-4 w-4" />;
    if (feature.includes('Sala')) return <Home className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const roomTypes = [
    { id: 'all', label: 'Todas las habitaciones' },
    { id: 'individual', label: 'Individual' },
    { id: 'doble', label: 'Doble' },
    { id: 'familiar', label: 'Familiar' }
  ];

  const [filterType, setFilterType] = useState('all');

  const filteredRooms = filterType === 'all' 
    ? rooms 
    : rooms.filter(room => room.type === filterType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Habitaciones</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestras elegantes habitaciones diseñadas para ofrecerte la máxima comodidad y relajación.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {roomTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                filterType === type.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    room.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {room.available ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-blue-600">${room.price}</span>
                  <span className="text-gray-500">por noche</span>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Características:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {room.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        {getIconForFeature(feature)}
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  {room.features.length > 4 && (
                    <button
                      onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                      className="text-blue-600 text-sm mt-2 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{selectedRoom === room.id ? 'Ver menos' : `Ver todas (${room.features.length})`}</span>
                    </button>
                  )}
                </div>

                {selectedRoom === room.id && room.features.length > 4 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Todas las características:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {room.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                          {getIconForFeature(feature)}
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => onNavigate('reservas')}
                    disabled={!room.available}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      room.available
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {room.available ? 'Reservar Ahora' : 'No Disponible'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hay habitaciones disponibles para este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}