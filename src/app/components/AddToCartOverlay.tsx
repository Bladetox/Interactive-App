import React from 'react';
import imgTomato from "../../assests/39a095c5219433210528f313f4db7ed09e8b6466.png";

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
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl p-4 z-50 flex items-center gap-4">
      <img
        src={product.images[0] || imgTomato}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{product.name}</p>
        <p className="text-sm text-gray-500">Added to basket</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        ✕
      </button>
    </div>
  );
};

export default AddToCartOverlay;
