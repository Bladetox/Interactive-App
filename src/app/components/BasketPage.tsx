import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import QuantityDropdown from '../figma/QuantityDropdown';

interface BasketPageProps {
  items: { product: { id: number; name: string; price: string; priceValue: number; images: string[] }; quantity: number }[];
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
}) => {
  const total = items.reduce((sum, item) => sum + item.product.priceValue * item.quantity, 0);

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">My Basket</h1>
        <span className="ml-auto text-sm text-gray-400">{items.length} items</span>
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
              <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl" />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">{item.product.name}</p>
                <p className="text-green-600 text-sm font-semibold">{item.product.price}</p>
                <QuantityDropdown
                  quantity={item.quantity}
                  onDecrease={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  onIncrease={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                />
              </div>
              <button onClick={() => onRemoveItem(item.product.id)} className="p-2 text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
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
