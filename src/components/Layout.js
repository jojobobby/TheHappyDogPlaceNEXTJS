import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, HelpCircle, Package, FileText } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Layout = ({ children }) => {
  const { cart } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            TheHappyDogPlace
          </Link>
          <nav className="flex items-center">
            <Link to="/cart" className="relative group">
              <ShoppingCart className="cursor-pointer group-hover:text-orange-400 transition-all duration-300 ease-in-out transform group-hover:scale-110" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs group-hover:bg-orange-500 transition-colors duration-300 ease-in-out">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
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
              to="/support" 
              className="flex items-center hover:text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <HelpCircle className="mr-2" size={20} />
              <span>Support</span>
            </Link>
            <Link 
              to="/track-package" 
              className="flex items-center hover:text-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Package className="mr-2" size={20} />
              <span>Track Package</span>
            </Link>
            <Link 
              to="/terms-of-service" 
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
  );
};

export default Layout;