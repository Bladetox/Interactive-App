import React from 'react';
import { ArrowLeft, Menu, ShoppingBasket } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  quantity: number;
}

interface ConfirmationPageProps {
  cartItems: CartItem[];
  cartCount: number;
  onBack: () => void;
  onMenuClick: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCompletePurchase: () => void;
}

export default function ConfirmationPage({
  cartItems,
  cartCount,
  onBack,
  onMenuClick,
  onUpdateQuantity,
  onCompletePurchase,
}: ConfirmationPageProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  return (
    <div className="flex flex-col min-h-screen bg-white w-full max-w-[412px] mx-auto">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <button onClick={onMenuClick} className="p-2 text-gray-700" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-[#426b1f]">World Peas</h1>
          <div className="relative p-2">
            <ShoppingBasket className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#426b1f] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-2xl font-['Newsreader:Regular',_sans-serif] tracking-tight text-gray-900">Confirmation</h2>
          <button onClick={onBack} className="flex items-center gap-1 text-[#426b1f] text-sm">
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        </div>
      </div>

      {/* Scrollable cart items */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-56 divide-y divide-gray-100">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-4 py-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-xl shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-[#426b1f] font-semibold">{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                −
              </button>
              <span className="text-sm w-4 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 w-14 text-right">
              ${(item.priceValue * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[412px] bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-6 pt-4 pb-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Taxes (8%)</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900 pt-1 border-t border-gray-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={onCompletePurchase}
          className="w-full bg-[#426b1f] text-white py-3 rounded-xl font-semibold hover:bg-[#365617] transition-colors flex items-center justify-between px-5"
        >
          <span>Complete purchase</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
