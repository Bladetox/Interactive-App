import React from 'react';

interface MenuProps {
  onClose: () => void;
  onNavigate: (page: any) => void;
  cartCount: number;
}

const Menu: React.FC<MenuProps> = ({ onClose, onNavigate, cartCount }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <button onClick={onClose} className="mb-6 text-gray-500">✕</button>
          <nav className="space-y-4">
            <button onClick={() => onNavigate('list')} className="block w-full text-left py-2 text-gray-700 hover:text-green-600">Shop</button>
            <button onClick={() => onNavigate('basket')} className="block w-full text-left py-2 text-gray-700 hover:text-green-600">Basket ({cartCount})</button>
            <button onClick={() => onNavigate('placeholder')} className="block w-full text-left py-2 text-gray-700 hover:text-green-600">Account</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Menu;
