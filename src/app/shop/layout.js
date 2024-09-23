import React from 'react';
import Link from 'next/link';
import { HelpCircle, Package, FileText } from 'lucide-react';
import { CartProvider } from '../contexts/CartContext';
import CartDisplay from '../components/CartDisplay';

const Layout = ({ children }) => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen font-sans">
        <header className="bg-gray-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105">
              TheHappyDogPlace
            </Link>
            <nav className="flex items-center">
              <CartDisplay />
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center space-x-6">
              <Link 
                href="/support" 
                className="flex items-center hover:text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <HelpCircle className="mr-2" size={20} />
                <span>Support</span>
              </Link>
              <Link 
                href="/track-package" 
                className="flex items-center hover:text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Package className="mr-2" size={20} />
                <span>Track Package</span>
              </Link>
              <Link 
                href="/terms-of-service" 
                className="flex items-center hover:text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <FileText className="mr-2" size={20} />
                <span>Terms of Service</span>
              </Link>
            </div>
            <div className="text-center mt-4 text-sm text-gray-400">
              © 2024 TheHappyDogPlace. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default Layout;