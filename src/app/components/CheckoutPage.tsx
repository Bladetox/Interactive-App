import React, { useState } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { Input } from '../ui/input';

interface CheckoutPageProps {
  items: { product: { name: string; price: string; priceValue: number; images: string[] }; quantity: number }[];
  cartTotal: number;
  onBack: () => void;
  onContinue: () => void;
  onMenuClick: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, cartTotal, onBack, onContinue, onMenuClick }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Checkout</h1>
        <button onClick={onMenuClick} className="ml-auto p-2 text-gray-700" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 space-y-4">
        <h2 className="font-medium text-gray-700">Delivery Address</h2>
        <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" />
        <div className="grid grid-cols-2 gap-3">
          <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
          <Input value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP code" />
        </div>

        <h2 className="font-medium text-gray-700 pt-2">Delivery Method</h2>
        <div className="space-y-2">
          {[{ id: 'standard', label: 'Standard', time: '2-4 hours', price: '$3.99' },
            { id: 'express', label: 'Express', time: '45-60 min', price: '$7.99' }].map(opt => (
            <label key={opt.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
              deliveryMethod === opt.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="delivery" value={opt.id} checked={deliveryMethod === opt.id}
                  onChange={() => setDeliveryMethod(opt.id)} className="accent-green-500" />
                <div>
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.time}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">{opt.price}</span>
            </label>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold mb-4">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onContinue}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
