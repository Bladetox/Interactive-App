import React, { useState } from 'react';
import { ShoppingBasket, Search, Menu, Trash2, Plus, Pencil, X } from 'lucide-react';
import { Input } from '../ui/input';
import type { Product } from '../App';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EMOJI_OPTIONS = [
  '☕','🍗','🥩','🥛','🥚','🍝','🍚','🍞','🧂','🫙',
  '🥜','🌿','🌶️','🥥','🧊','🍓','🍄','🫑','🍇','🧈',
  '🍜','💧','🐟','🍅','🧅','🥔','🧀','🚿','🛁','💨',
  '🧴','🧹','🧼','🧻','🦷','🩹','💆','🪒','🧺','🧽',
  '🍬','🚬','🫘','🥦','🥗','🫚','⚫','🍆','🥕','🦌',
  '🐘','🍎','🍌','🍒','🍣','🍱','🍳','🥪','🌭','🛒',
];

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Spices', 'Toiletries', 'Cleaning', 'Miscellaneous'];

// ---------------------------------------------------------------------------
// Add Item Modal
// ---------------------------------------------------------------------------
interface AddItemModalProps {
  onClose: () => void;
  onAdd: (item: Omit<Product, 'id' | 'isFavorite'>) => void;
}

function AddItemModal({ onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Miscellaneous');
  const [emoji, setEmoji] = useState('🛒');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseFloat(price);
    if (!name.trim() || isNaN(priceVal) || priceVal < 0) return;
    onAdd({ name: name.trim(), price: `R${priceVal.toFixed(2)}`, priceValue: priceVal, category, emoji });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white w-full max-w-[412px] rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Add Item</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji picker */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Choose emoji <span className="text-2xl ml-2">{emoji}</span></p>
            <div className="grid grid-cols-10 gap-1 max-h-28 overflow-y-auto">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setEmoji(e)}
                  className={`text-xl rounded-lg p-1 transition-colors ${
                    emoji === e ? 'bg-green-100 ring-2 ring-green-500' : 'hover:bg-gray-100'
                  }`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Oat milk" required />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (ZAR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R</span>
              <Input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="0.00" className="pl-7" required />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                    category === cat ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600">
            Add to list
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Emoji picker overlay
// ---------------------------------------------------------------------------
interface EmojiOverlayProps {
  currentEmoji: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

function EmojiOverlay({ currentEmoji, onSelect, onClose }: EmojiOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white w-full max-w-[412px] rounded-t-3xl p-5 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Pick emoji</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {EMOJI_OPTIONS.map(e => (
            <button key={e} onClick={() => { onSelect(e); onClose(); }}
              className={`text-xl rounded-lg p-1.5 transition-colors ${
                currentEmoji === e ? 'bg-green-100 ring-2 ring-green-500' : 'hover:bg-gray-100'
              }`}>
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ProductListPage
// ---------------------------------------------------------------------------
interface ProductListPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onDeleteProduct: (productId: number) => void;
  onAddProduct: (item: Omit<Product, 'id' | 'isFavorite'>) => void;
  onUpdateEmoji: (productId: number, emoji: string) => void;
  cartCount: number;
  onBasketClick: () => void;
  onMenuClick: () => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({
  products, onAddToCart, onDeleteProduct, onAddProduct, onUpdateEmoji,
  cartCount, onBasketClick, onMenuClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState<Product | null>(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeFilter === 'All' || p.category === activeFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onMenuClick} className="p-2">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Shopping List</h1>
        <div className="flex items-center gap-1">
          <button onClick={() => setEditMode(v => !v)}
            className={`p-2 rounded-full transition-colors ${
              editMode ? 'bg-red-100 text-red-500' : 'text-gray-700'
            }`}>
            {editMode ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
          </button>
          <button onClick={onBasketClick} className="relative p-2">
            <ShoppingBasket className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search items..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200" />
        </div>
      </div>

      {/* Category filter tabs — horizontally scrollable */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeFilter === cat
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div className="mx-4 mb-3 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 text-center">
          Edit mode — tap 🗑️ to delete · tap emoji to change it
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm">No items found</p>
          </div>
        ) : (
          filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <button
                  onClick={() => editMode && setEmojiTarget(product)}
                  className={`w-full h-28 flex items-center justify-center bg-gray-50 text-5xl select-none ${
                    editMode ? 'cursor-pointer active:bg-gray-100' : 'cursor-default'
                  }`}>
                  {product.emoji}
                </button>
                {editMode && (
                  <button onClick={() => onDeleteProduct(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full shadow-sm">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-800 text-sm leading-tight">{product.name}</p>
                <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">{product.price}</span>
                  {!editMode && (
                    <button onClick={() => onAddToCart(product)}
                      className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-lg leading-none hover:bg-green-600">
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      {!editMode && (
        <button onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-1/2 translate-x-[190px] w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 z-40">
          <Plus className="w-7 h-7 text-white" />
        </button>
      )}

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={onAddProduct} />}
      {emojiTarget && (
        <EmojiOverlay
          currentEmoji={emojiTarget.emoji}
          onSelect={emoji => onUpdateEmoji(emojiTarget.id, emoji)}
          onClose={() => setEmojiTarget(null)}
        />
      )}
    </div>
  );
};

export default ProductListPage;
