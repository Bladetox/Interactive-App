import React from 'react';

interface AddToCartOverlayProps {
  product: {
    name: string;
    price: string;
    emoji: string;
  };
  onClose: () => void;
}

const AddToCartOverlay: React.FC<AddToCartOverlayProps> = ({ product, onClose }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 w-[340px] z-50">
      <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl text-3xl">
        {product.emoji}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800">{product.name}</p>
        <p className="text-xs text-green-600">Added to basket</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
    </div>
  );
};

export default AddToCartOverlay;
