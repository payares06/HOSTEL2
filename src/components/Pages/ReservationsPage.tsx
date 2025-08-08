import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users, Mail, Phone, CreditCard, CheckCircle } from 'lucide-react';

export function ReservationsPage() {
  const { rooms, addReservation, currentUser, reservations } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedRoom = rooms.find(room => room.id === formData.roomId);
    if (!selectedRoom) return;

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    addReservation({
      ...formData,
      roomName: selectedRoom.name,
      totalPrice: selectedRoom.price * nights,
      status: 'pending'
    });

    setShowSuccess(true);
    setShowForm(false);
    setFormData({
      roomId: '',
      guestName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: 1
    });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filter reservations for current user if logged in as client
  const userReservations = currentUser?.role === 'client' 
    ? reservations.filter(res => res.email === currentUser.email)
    : reservations;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Reservas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentUser?.role === 'admin' 
              ? 'Gestiona todas las reservas del hotel'
              : 'Reserva tu habitación ideal o consulta tus reservas existentes'
            }
          </p>
        </div>

        {showSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-green-800 font-medium">¡Reserva realizada con éxito!</h3>
              <p className="text-green-700 text-sm">Te contactaremos pronto para confirmar tu reserva.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* New Reservation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nueva Reserva</h2>
              
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Hacer Reserva
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Habitación
                    </label>
                    <select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una habitación</option>
                      {rooms.filter(room => room.available).map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name} - ${room.price}/noche
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        required
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de huéspedes
                    </label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      min="1"
                      max="4"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Confirmar Reserva
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Reservations List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentUser?.role === 'admin' ? 'Todas las Reservas' : 'Mis Reservas'}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {userReservations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No hay reservas {currentUser?.role === 'client' ? 'tuyas' : ''} disponibles.
                  </div>
                ) : (
                  userReservations.map((reservation) => (
                    <div key={reservation.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reservation.roomName}</h3>
                          <p className="text-gray-600">{reservation.guestName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{reservation.checkIn} - {reservation.checkOut}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{reservation.guests} huésped{reservation.guests !== 1 ? 'es' : ''}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{reservation.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{reservation.phone}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-lg font-semibold text-blue-600">
                          <CreditCard className="h-5 w-5" />
                          <span>Total: ${reservation.totalPrice}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Reservado el {new Date(reservation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}