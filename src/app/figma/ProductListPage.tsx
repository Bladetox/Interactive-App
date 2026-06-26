import React, { useState } from 'react';
import { Heart, ShoppingBasket, Search, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { categoryEmoji, defaultEmoji } from '../shared/categoryEmoji';
import type { Product } from '../App';

interface ProductListPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleFavorite: (productId: number) => void;
  cartCount: number;
  onBasketClick: () => void;
  onMenuClick: () => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({
  products,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  cartCount,
  onBasketClick,
  onMenuClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Groceries', 'Toiletries'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'All' || p.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const available = filteredProducts.filter(p => p.available);
  const unavailable = filteredProducts.filter(p => !p.available);
  const sorted = [...available, ...unavailable];

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onMenuClick} className="p-2">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Shopping List</h1>
        <button onClick={onBasketClick} className="relative p-2">
          <ShoppingBasket className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-8">
        {sorted.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm">No items found</p>
          </div>
        ) : (
          sorted.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-opacity ${
                product.available ? 'border-gray-100 opacity-100' : 'border-gray-100 opacity-40'
              }`}
            >
              <div
                className="relative cursor-pointer"
                onClick={() => product.available && onProductClick(product)}
              >
                {/* Emoji thumbnail */}
                <div className="w-full h-28 flex items-center justify-center bg-gray-50 text-5xl select-none">
                  {categoryEmoji[product.name] ?? defaultEmoji}
                </div>
                {!product.available && (
                  <div className="absolute inset-0 flex items-end justify-center pb-2">
                    <span className="text-[10px] bg-gray-700 text-white px-2 py-0.5 rounded-full">Unavailable</span>
                  </div>
                )}
                <button
                  onClick={e => { e.stopPropagation(); onToggleFavorite(product.id); }}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      product.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-800 text-sm leading-tight">{product.name}</p>
                <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">{product.price}</span>
                  {product.available && (
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
