import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ProductListPage from './figma/ProductListPage';
import BasketPage from './components/BasketPage';
import ConfirmationPage from './components/ConfirmationPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentPage from './figma/PaymentPage';
import OrderConfirmationPage from './figma/OrderConfirmationPage';
import AddToCartOverlay from './components/AddToCartOverlay';
import Menu from './figma/Menu';
import { DEFAULT_DELIVERY, DeliveryOption } from './shared/deliveryTypes';

export type Page = 'list' | 'basket' | 'confirmation' | 'checkout' | 'payment' | 'orderConfirmation';

export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  category: string;
  emoji: string;
  isFavorite: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  items: CartItem[];
  total: number;
  deliveryMethod: string;
  deliveryTime: string;
}

const PAGE_ORDER: Page[] = ['list', 'basket', 'confirmation', 'checkout', 'payment', 'orderConfirmation'];

const pageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
  center: {
    x: 0, opacity: 1, scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 35 },
      opacity: { duration: 0.22 },
      scale: { duration: 0.22 },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 60 : -60, opacity: 0, scale: 0.98,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 35 },
      opacity: { duration: 0.18 },
      scale: { duration: 0.18 },
    },
  }),
};

const STORAGE_KEY = 'shopping_list_items';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Coffee', price: 'R89.99', priceValue: 89.99, category: 'Miscellaneous', emoji: '☕', isFavorite: false },
  { id: 2, name: 'Chicken', price: 'R79.99', priceValue: 79.99, category: 'Meat', emoji: '🍗', isFavorite: false },
  { id: 3, name: 'Mince / Meat', price: 'R89.99', priceValue: 89.99, category: 'Meat', emoji: '🥩', isFavorite: false },
  { id: 4, name: 'Fresh cream', price: 'R24.99', priceValue: 24.99, category: 'Miscellaneous', emoji: '🥛', isFavorite: false },
  { id: 5, name: 'Eggs', price: 'R39.99', priceValue: 39.99, category: 'Miscellaneous', emoji: '🥚', isFavorite: false },
  { id: 6, name: 'Pasta', price: 'R19.99', priceValue: 19.99, category: 'Miscellaneous', emoji: '🍝', isFavorite: false },
  { id: 7, name: 'Rice', price: 'R34.99', priceValue: 34.99, category: 'Miscellaneous', emoji: '🍚', isFavorite: false },
  { id: 8, name: 'Bread', price: 'R18.99', priceValue: 18.99, category: 'Miscellaneous', emoji: '🍞', isFavorite: false },
  { id: 9, name: 'Aromat', price: 'R29.99', priceValue: 29.99, category: 'Spices', emoji: '🧂', isFavorite: false },
  { id: 10, name: 'Mayonnaise', price: 'R34.99', priceValue: 34.99, category: 'Miscellaneous', emoji: '🥫', isFavorite: false },
  { id: 11, name: 'Peanut butter', price: 'R44.99', priceValue: 44.99, category: 'Miscellaneous', emoji: '🥜', isFavorite: false },
  { id: 12, name: 'Spring onion', price: 'R9.99', priceValue: 9.99, category: 'Vegetables', emoji: '🧅', isFavorite: false },
  { id: 13, name: 'Coriander', price: 'R9.99', priceValue: 9.99, category: 'Vegetables', emoji: '🌿', isFavorite: false },
  { id: 14, name: 'Parsley', price: 'R9.99', priceValue: 9.99, category: 'Vegetables', emoji: '🌿', isFavorite: false },
  { id: 15, name: 'Pepper corns', price: 'R24.99', priceValue: 24.99, category: 'Spices', emoji: '⚫', isFavorite: false },
  { id: 16, name: 'Chillies', price: 'R14.99', priceValue: 14.99, category: 'Vegetables', emoji: '🌶️', isFavorite: false },
  { id: 17, name: 'Coconut milk', price: 'R29.99', priceValue: 29.99, category: 'Miscellaneous', emoji: '🥥', isFavorite: false },
  { id: 18, name: 'Stock cubes', price: 'R19.99', priceValue: 19.99, category: 'Spices', emoji: '🧊', isFavorite: false },
  { id: 19, name: 'Brown onion spice', price: 'R24.99', priceValue: 24.99, category: 'Spices', emoji: '🧂', isFavorite: false },
  { id: 20, name: 'Ground ginger spice', price: 'R24.99', priceValue: 24.99, category: 'Spices', emoji: '🫚', isFavorite: false },
  { id: 21, name: 'Strawberry jam', price: 'R29.99', priceValue: 29.99, category: 'Fruits', emoji: '🍓', isFavorite: false },
  { id: 22, name: 'Mushrooms', price: 'R24.99', priceValue: 24.99, category: 'Vegetables', emoji: '🍄', isFavorite: false },
  { id: 23, name: 'Peppers', price: 'R19.99', priceValue: 19.99, category: 'Vegetables', emoji: '🫑', isFavorite: false },
  { id: 24, name: 'Mixed fruit jam', price: 'R29.99', priceValue: 29.99, category: 'Fruits', emoji: '🍇', isFavorite: false },
  { id: 25, name: 'Butter', price: 'R49.99', priceValue: 49.99, category: 'Miscellaneous', emoji: '🧈', isFavorite: false },
  { id: 26, name: 'Noodles', price: 'R14.99', priceValue: 14.99, category: 'Miscellaneous', emoji: '🍜', isFavorite: false },
  { id: 27, name: 'Water', price: 'R12.99', priceValue: 12.99, category: 'Miscellaneous', emoji: '💧', isFavorite: false },
  { id: 28, name: 'Tuna', price: 'R24.99', priceValue: 24.99, category: 'Meat', emoji: '🐟', isFavorite: false },
  { id: 29, name: 'Tinned fish', price: 'R19.99', priceValue: 19.99, category: 'Meat', emoji: '🐠', isFavorite: false },
  { id: 30, name: 'Tomato paste', price: 'R14.99', priceValue: 14.99, category: 'Vegetables', emoji: '🍅', isFavorite: false },
  { id: 31, name: 'Onions', price: 'R14.99', priceValue: 14.99, category: 'Vegetables', emoji: '🧅', isFavorite: false },
  { id: 32, name: 'Potatoes', price: 'R24.99', priceValue: 24.99, category: 'Vegetables', emoji: '🥔', isFavorite: false },
  { id: 33, name: 'Cheese', price: 'R59.99', priceValue: 59.99, category: 'Miscellaneous', emoji: '🧀', isFavorite: false },
  { id: 34, name: 'Cooking oil', price: 'R44.99', priceValue: 44.99, category: 'Miscellaneous', emoji: '🫙', isFavorite: false },
  { id: 35, name: 'Milk', price: 'R22.99', priceValue: 22.99, category: 'Miscellaneous', emoji: '🥛', isFavorite: false },
  { id: 36, name: 'Drain cleaner', price: 'R34.99', priceValue: 34.99, category: 'Cleaning', emoji: '🧴', isFavorite: false },
  { id: 37, name: 'Crushed chillies', price: 'R24.99', priceValue: 24.99, category: 'Spices', emoji: '🌶️', isFavorite: false },
  { id: 38, name: 'Dry cook in sauce', price: 'R19.99', priceValue: 19.99, category: 'Spices', emoji: '🥫', isFavorite: false },
  { id: 39, name: 'Stir fry veggies', price: 'R29.99', priceValue: 29.99, category: 'Vegetables', emoji: '🥦', isFavorite: false },
  { id: 40, name: 'Mixed veggies', price: 'R24.99', priceValue: 24.99, category: 'Vegetables', emoji: '🥗', isFavorite: false },
  { id: 41, name: 'Red kidney beans', price: 'R19.99', priceValue: 19.99, category: 'Vegetables', emoji: '🫘', isFavorite: false },
  { id: 42, name: 'Red lentils', price: 'R24.99', priceValue: 24.99, category: 'Vegetables', emoji: '🫘', isFavorite: false },
  { id: 43, name: 'Chicken liver', price: 'R34.99', priceValue: 34.99, category: 'Meat', emoji: '🍗', isFavorite: false },
  { id: 44, name: 'Cigarettes', price: 'R49.99', priceValue: 49.99, category: 'Miscellaneous', emoji: '🚬', isFavorite: false },
  { id: 45, name: 'Dishwashing sponges', price: 'R14.99', priceValue: 14.99, category: 'Cleaning', emoji: '🧽', isFavorite: false },
  { id: 46, name: 'Sweet treat', price: 'R29.99', priceValue: 29.99, category: 'Miscellaneous', emoji: '🍬', isFavorite: false },
  { id: 47, name: 'Shaving blades', price: 'R79.99', priceValue: 79.99, category: 'Toiletries', emoji: '🪒', isFavorite: false },
  { id: 48, name: 'Nivea body cream', price: 'R69.99', priceValue: 69.99, category: 'Toiletries', emoji: '🧴', isFavorite: false },
  { id: 49, name: 'Nivea men shower gel', price: 'R59.99', priceValue: 59.99, category: 'Toiletries', emoji: '🚿', isFavorite: false },
  { id: 50, name: 'Nivea men deo spray', price: 'R54.99', priceValue: 54.99, category: 'Toiletries', emoji: '🫧', isFavorite: false },
  { id: 51, name: 'Comfort laundry detergent', price: 'R89.99', priceValue: 89.99, category: 'Cleaning', emoji: '🧺', isFavorite: false },
  { id: 52, name: 'OSH body wash', price: 'R49.99', priceValue: 49.99, category: 'Toiletries', emoji: '🛁', isFavorite: false },
  { id: 53, name: 'Handwash', price: 'R34.99', priceValue: 34.99, category: 'Toiletries', emoji: '🧼', isFavorite: false },
  { id: 54, name: 'Toilet paper', price: 'R54.99', priceValue: 54.99, category: 'Toiletries', emoji: '🧻', isFavorite: false },
  { id: 55, name: 'Toothpaste', price: 'R34.99', priceValue: 34.99, category: 'Toiletries', emoji: '🪥', isFavorite: false },
  { id: 56, name: 'Flushable wet wipes', price: 'R44.99', priceValue: 44.99, category: 'Toiletries', emoji: '🫧', isFavorite: false },
  { id: 57, name: 'Handy Andy', price: 'R29.99', priceValue: 29.99, category: 'Cleaning', emoji: '🧹', isFavorite: false },
  { id: 58, name: 'Cotton pads', price: 'R24.99', priceValue: 24.99, category: 'Toiletries', emoji: '🩹', isFavorite: false },
  { id: 59, name: 'Curl product / Treatment', price: 'R89.99', priceValue: 89.99, category: 'Toiletries', emoji: '💆', isFavorite: false },
  { id: 60, name: 'Head and Shoulders', price: 'R64.99', priceValue: 64.99, category: 'Toiletries', emoji: '🧴', isFavorite: false },
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [direction, setDirection] = useState(1);
  const prevPageRef = useRef<Page>('list');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [addToCartProduct, setAddToCartProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(DEFAULT_DELIVERY);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setProducts(JSON.parse(saved)); }
      catch { setProducts(INITIAL_PRODUCTS); }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, loading]);

  // navigate defined before any handler that uses it
  const navigate = (page: Page) => {
    const from = PAGE_ORDER.indexOf(prevPageRef.current);
    const to = PAGE_ORDER.indexOf(page);
    setDirection(to >= from ? 1 : -1);
    prevPageRef.current = page;
    setCurrentPage(page);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setIsMenuOpen(false);
    navigate('list');
  };

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.product.priceValue * i.quantity, 0), [cart]);
  const confirmationCartItems = useMemo(() =>
    cart.map(i => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      priceValue: i.product.priceValue,
      image: i.product.emoji,
      quantity: i.quantity,
    })), [cart]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { product, quantity }];
    });
    setAddToCartProduct(product);
    setShowAddToCart(true);
    setTimeout(() => setShowAddToCart(false), 2000);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) setCart(prev => prev.filter(i => i.product.id !== productId));
    else setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  const handleRemoveItem = (productId: number) => setCart(prev => prev.filter(i => i.product.id !== productId));

  const handleOrderComplete = (order: Order) => {
    setCompletedOrder(order);
    setCart([]);
    setSelectedDelivery(DEFAULT_DELIVERY);
    navigate('orderConfirmation');
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'isFavorite'>) => {
    const id = Date.now();
    setProducts(prev => [...prev, { ...newProduct, id, isFavorite: false }]);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleUpdateEmoji = (productId: number, emoji: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, emoji } : p));
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, product: { ...i.product, emoji } } : i));
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setCart(prev => prev.map(i => i.product.id === updated.id ? { ...i, product: updated } : i));
  };

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'list':
        return (
          <ProductListPage
            products={products}
            onAddToCart={handleAddToCart}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
            onUpdateEmoji={handleUpdateEmoji}
            onUpdateProduct={handleUpdateProduct}
            cartCount={cartCount}
            onBasketClick={() => navigate('basket')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'basket':
        return (
          <BasketPage
            items={cart}
            onBack={() => navigate('list')}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => navigate('confirmation')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationPage
            cartItems={confirmationCartItems}
            cartCount={cartCount}
            onBack={() => navigate('basket')}
            onMenuClick={() => setIsMenuOpen(true)}
            onUpdateQuantity={handleUpdateQuantity}
            onCompletePurchase={() => navigate('checkout')}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            items={cart}
            cartTotal={cartTotal}
            onBack={() => navigate('confirmation')}
            onContinue={() => navigate('payment')}
            onMenuClick={() => setIsMenuOpen(true)}
            selectedDelivery={selectedDelivery}
            onDeliveryChange={setSelectedDelivery}
          />
        );
      case 'payment':
        return (
          <PaymentPage
            items={cart}
            cartTotal={cartTotal}
            selectedDelivery={selectedDelivery}
            onBack={() => navigate('checkout')}
            onOrderComplete={handleOrderComplete}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'orderConfirmation':
        return completedOrder ? (
          <OrderConfirmationPage
            order={completedOrder}
            onContinueShopping={() => navigate('list')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="app h-dvh flex flex-col overflow-hidden bg-white">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex-1 overflow-y-auto"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {showAddToCart && addToCartProduct && (
        <AddToCartOverlay product={addToCartProduct} onClose={() => setShowAddToCart(false)} />
      )}
      {isMenuOpen && (
        <Menu
          onClose={() => setIsMenuOpen(false)}
          onNavigate={(page: Page) => { setIsMenuOpen(false); navigate(page); }}
          cartCount={cartCount}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
