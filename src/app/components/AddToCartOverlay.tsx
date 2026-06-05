import React from 'react';
import imgTomato from "../assests/39a095c5219433210528f313f4db7ed09e8b6466.png";

interface AddToCartOverlayProps {
  product: {
    name: string;
    price: string;
    images: string[];
  };
  onClose: () => void;
}

const AddToCartOverlay: React.FC<AddToCartOverlayProps> = ({ product, onClose }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 w-[340px] z-50">
      <img
        src={product.images[0] || imgTomato}
        alt={product.name}
        className="w-12 h-12 object-cover rounded-xl"
      />
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800">{product.name}</p>
        <p className="text-xs text-green-600">Added to basket</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
    </div>
  );
};

export default AddToCartOverlay;
