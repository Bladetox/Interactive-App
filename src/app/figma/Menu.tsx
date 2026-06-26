import React, { useState } from 'react';
import { ShoppingBag, ShoppingBasket, RotateCcw, X, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'shopping_list_items';

interface MenuProps {
  onClose: () => void;
  onNavigate: (page: any) => void;
  cartCount: number;
  onReset: () => void;
}

const Menu: React.FC<MenuProps> = ({ onClose, onNavigate, cartCount, onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Menu</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          <button onClick={() => onNavigate('list')}
            className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Shop</span>
          </button>
          <button onClick={() => onNavigate('basket')}
            className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
            <ShoppingBasket className="w-5 h-5" />
            <span className="font-medium">Basket</span>
            {cartCount > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </nav>

        {/* Footer — reset */}
        <div className="px-4 pb-8 border-t border-gray-100 pt-4">
          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
              <RotateCcw className="w-5 h-5" />
              <span className="font-medium text-sm">Reset to defaults</span>
            </button>
          ) : (
            <div className="bg-red-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 leading-relaxed">
                  This will remove all your custom items and restore the original list. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleReset}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600">
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
