export interface DeliveryOption {
  id: 'standard' | 'express';
  label: string;
  time: string;
  fee: number;
  feeLabel: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'standard', label: 'Standard', time: '2–4 hours', fee: 3.99, feeLabel: '$3.99' },
  { id: 'express', label: 'Express',  time: '45–60 min', fee: 7.99, feeLabel: '$7.99' },
];

export const DEFAULT_DELIVERY = DELIVERY_OPTIONS[0];
