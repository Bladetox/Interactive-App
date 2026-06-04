import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../ui/input';

interface PaymentPageProps {
  items: { product: { name: string; price: string; priceValue: number; images: string[] }; quantity: number }[];
  cartTotal: number;
  onBack: () => void;
  onOrderComplete: (order: any) => void;
  onMenuClick: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ items, cartTotal, onBack, onOrderComplete }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderComplete({
      items,
      total: cartTotal + 3.99,
      deliveryMethod: 'Standard Delivery',
      deliveryTime: '2-4 hours',
    });
  };

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Payment</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
            <Input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <Input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123" required />
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery</span>
            <span>$3.99</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${(cartTotal + 3.99).toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 mt-4"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
