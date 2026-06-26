import React, { useState } from 'react';
import { ArrowLeft, ShoppingBasket, Menu } from 'lucide-react';
import { categoryEmoji, defaultEmoji } from '../shared/categoryEmoji';
import type { Product } from '../App';

interface ProductDetailPageProps {
  product: Product;
  cartCount: number;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onMenuClick: () => void;
  onCartClick: () => void;
}

export default function ProductDetailPage({
  product,
  cartCount,
  onBack,
  onAddToCart,
  onMenuClick,
  onCartClick,
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white w-full max-w-[412px] mx-auto">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <button onClick={onMenuClick} className="p-2 text-gray-700" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-[#426b1f]">Shopping List</h1>
          <button onClick={onCartClick} className="relative p-2">
            <ShoppingBasket className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#426b1f] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{product.name}</h2>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[#426b1f] text-sm"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        </div>
      </div>

      {/* Emoji hero */}
      <div className="w-full h-[240px] flex items-center justify-center bg-gray-50 text-8xl select-none">
        {categoryEmoji[product.name] ?? defaultEmoji}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-4">
        <div>
          <p className="text-2xl font-bold text-[#426b1f]">{product.price}</p>
          <p className="text-sm text-gray-400 mt-1">{product.category}</p>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[412px] bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium min-w-[58px]"
            >
              {quantity}
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 6 9">
                <path d="M1 1L4.5 4.5L1 8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            {showQuantityDropdown && (
              <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 min-w-[58px]">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    onClick={() => { setQuantity(n); setShowQuantityDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 bg-[#426b1f] text-white rounded-lg py-3 text-sm font-medium flex items-center justify-between px-5 hover:bg-[#365617] transition-colors"
          >
            <span>Add to basket</span>
            <ShoppingBasket className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
