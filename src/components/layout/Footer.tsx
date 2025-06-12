import React from 'react';
import { Heart, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">HealthConnect</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting patients with verified doctors across developing countries. 
              Get reliable health information and professional medical consultations.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="h-4 w-4 mr-1" />
                Available across Africa
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Doctors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Testing Centers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +233-XX-XXX-XXXX
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                hello@healthconnect.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 HealthConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}