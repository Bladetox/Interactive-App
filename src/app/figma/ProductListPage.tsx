import React, { useState } from 'react';
import { Heart, ShoppingBasket, Search, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import StatusBar from '../shared/StatusBar';

interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  farm: string;
  images: string[];
  isFavorite: boolean;
  description: string;
  location: string;
  dietary: string[];
}

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

  const filters = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Roots'];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-2">
        <button onClick={onMenuClick} className="p-2">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Fresh Produce</h1>
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
            placeholder="Search produce..."
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
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div
              className="relative cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-36 object-cover"
              />
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
              <p className="font-medium text-gray-800 text-sm">{product.name}</p>
              <p className="text-xs text-gray-400 mb-2">{product.farm}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold text-sm">{product.price}</span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
