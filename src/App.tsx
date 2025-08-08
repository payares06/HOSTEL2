import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Pages/HomePage';
import { AboutPage } from './components/Pages/AboutPage';
import { RoomsPage } from './components/Pages/RoomsPage';
import { ReservationsPage } from './components/Pages/ReservationsPage';
import { GalleryPage } from './components/Pages/GalleryPage';
import { ContactPage } from './components/Pages/ContactPage';
import { LoginPage } from './components/Pages/LoginPage';
import { AdminDashboard } from './components/Pages/AdminDashboard';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const { currentUser } = useApp();

  const renderPage = () => {
    // If user is admin and on reservas page, show admin dashboard
    if (currentPage === 'reservas' && currentUser?.role === 'admin') {
      return <AdminDashboard />;
    }

    switch (currentPage) {
      case 'inicio':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'nosotros':
        return <AboutPage />;
      case 'habitaciones':
        return <RoomsPage onNavigate={setCurrentPage} />;
      case 'reservas':
        return <ReservationsPage />;
      case 'galeria':
        return <GalleryPage />;
      case 'contacto':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;