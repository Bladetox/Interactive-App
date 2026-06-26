import React from 'react';

interface OrderConfirmationPageProps {
  order: {
    items: { product: { name: string; price: string; emoji: string }; quantity: number }[];
    total: number;
    deliveryMethod: string;
    deliveryTime: string;
  };
  onContinueShopping: () => void;
  onMenuClick: () => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onContinueShopping }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>
        <div className="text-left space-y-2 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm gap-2">
              <span className="text-xl">{item.product.emoji}</span>
              <span className="flex-1">{item.product.name} ×{item.quantity}</span>
              <span className="text-gray-500">{item.product.price}</span>
            </div>
          ))}
        </div>
        <p className="text-lg font-semibold mb-6">Total: R{order.total.toFixed(2)}</p>
        <button
          onClick={onContinueShopping}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
