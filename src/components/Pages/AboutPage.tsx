import React from 'react';
import { Award, Users, Clock, MapPin } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre Hotel Elegance</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una experiencia hotelera excepcional desde 1985, combinando tradición, elegancia y servicio personalizado.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
            <p className="text-gray-700 mb-6">
              Hotel Elegance nació como un sueño familiar de crear un espacio donde cada huésped se sintiera como en casa. 
              Desde nuestros inicios en 1985, hemos mantenido el compromiso de ofrecer una experiencia única que combina 
              la calidez del servicio personalizado con las comodidades modernas.
            </p>
            <p className="text-gray-700 mb-6">
              A lo largo de los años, hemos evolucionado constantemente, renovando nuestras instalaciones y adaptándonos 
              a las necesidades cambiantes de nuestros huéspedes, pero siempre manteniendo nuestra esencia: 
              la atención excepcional y el detalle en cada aspecto de la estancia.
            </p>
            <p className="text-gray-700">
              Hoy, somos reconocidos como uno de los hoteles más prestigiosos de la región, 
              con una reputación construida sobre décadas de excelencia en hospitalidad.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg" 
              alt="Lobby elegante del hotel"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">39 años</h3>
            <p className="text-gray-600">de experiencia en hospitalidad</p>
          </div>
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
            <p className="text-gray-600">huéspedes satisfechos</p>
          </div>
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
            <p className="text-gray-600">servicio al cliente</p>
          </div>
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Centro</h3>
            <p className="text-gray-600">ubicación privilegiada</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nuestra Misión</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Excelencia</h3>
              <p className="text-gray-700">
                Nos comprometemos a superar las expectativas de nuestros huéspedes en cada interacción, 
                ofreciendo un servicio impecable y atención personalizada.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comodidad</h3>
              <p className="text-gray-700">
                Creamos espacios acogedores y funcionales donde nuestros huéspedes puedan relajarse, 
                trabajar y disfrutar de momentos inolvidables.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovación</h3>
              <p className="text-gray-700">
                Incorporamos constantemente nuevas tecnologías y servicios para mejorar la experiencia 
                de nuestros huéspedes y mantenernos a la vanguardia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}