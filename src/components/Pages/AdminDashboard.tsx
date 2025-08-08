import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users, Bed, DollarSign, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const { reservations, rooms, updateReservationStatus } = useApp();

  const stats = {
    totalReservations: reservations.length,
    confirmedReservations: reservations.filter(r => r.status === 'confirmed').length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    totalRevenue: reservations
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + r.totalPrice, 0),
    occupancyRate: Math.round((reservations.filter(r => r.status === 'confirmed').length / rooms.length) * 100)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona las reservas y monitorea el desempeño del hotel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmedReservations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingReservations}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocupación</p>
                <p className="text-2xl font-bold text-blue-600">{stats.occupancyRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Reservations Management */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Reservas</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reserva
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Huésped
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{reservation.roomName}</p>
                        <p className="text-sm text-gray-500">ID: {reservation.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{reservation.guestName}</p>
                        <p className="text-sm text-gray-500">{reservation.email}</p>
                        <p className="text-sm text-gray-500">{reservation.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <p>Check-in: {reservation.checkIn}</p>
                        <p>Check-out: {reservation.checkOut}</p>
                        <p className="text-gray-500">{reservation.guests} huésped{reservation.guests !== 1 ? 'es' : ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(reservation.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.status)}`}>
                          {reservation.status === 'confirmed' ? 'Confirmada' : 
                           reservation.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${reservation.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors duration-200"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Cancelar
                        </button>
                      )}
                      {reservation.status === 'cancelled' && (
                        <span className="text-gray-500">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {reservations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay reservas disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}