import React from 'react';
import { ArrowLeft, Trash2, Menu } from 'lucide-react';

interface BasketPageProps {
  items: { product: { id: number; name: string; price: string; priceValue: number; emoji: string }; quantity: number }[];
  onBack: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  onMenuClick: () => void;
}

const BasketPage: React.FC<BasketPageProps> = ({
  items,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onMenuClick,
}) => {
  const total = items.reduce((sum, item) => sum + item.product.priceValue * item.quantity, 0);

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">
      <div className="flex items-center gap-3 px-4 pt-4 pb-4">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">My Basket</h1>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-sm text-gray-400">{items.length} items</span>
          <button onClick={onMenuClick} className="p-2 text-gray-700" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-4xl mb-3">🛒</p>
          <p>Your basket is empty</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl text-3xl shrink-0">
                {item.product.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{item.product.name}</p>
                <p className="text-green-600 text-sm font-semibold">{item.product.price}</p>
                {/* Inline quantity controls — no QuantityDropdown dependency */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm"
                  >−</button>
                  <span className="text-sm w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm"
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => onRemoveItem(item.product.id)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400">R{(item.product.priceValue * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 pb-8">
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketPage;
