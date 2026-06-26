import React, { useState } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { DeliveryOption } from '../shared/deliveryTypes';

interface PaymentPageProps {
  items: { product: { name: string; price: string; priceValue: number; images: string[] }; quantity: number }[];
  cartTotal: number;
  selectedDelivery: DeliveryOption;
  onBack: () => void;
  onOrderComplete: (order: any) => void;
  onMenuClick: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  items,
  cartTotal,
  selectedDelivery,
  onBack,
  onOrderComplete,
  onMenuClick,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const orderTotal = cartTotal + selectedDelivery.fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderComplete({
      items,
      total: orderTotal,
      deliveryMethod: `${selectedDelivery.label} Delivery`,
      deliveryTime: selectedDelivery.time,
    });
  };

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Payment</h1>
        <button onClick={onMenuClick} className="ml-auto p-2 text-gray-700" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
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
            <span className="text-gray-500">{selectedDelivery.label} Delivery</span>
            <span>{selectedDelivery.feeLabel}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
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
