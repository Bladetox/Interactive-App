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

// ─ Types ──────────────────────────────────────────────────────────────────
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

  // Load products: localStorage first, then prices.json seed
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
        setLoading(false);
        return;
      } catch {}
    }
    fetch(`${import.meta.env.BASE_URL}prices.json`)
      .then(r => r.json())
      .then((data: { items: Array<{ id: number; name: string; price: number; category: string; emoji: string }> }) => {
        const mapped: Product[] = data.items.map(item => ({
          id: item.id,
          name: item.name,
          price: `R${item.price.toFixed(2)}`,
          priceValue: item.price,
          category: item.category,
          emoji: item.emoji,
          isFavorite: false,
        }));
        setProducts(mapped);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Persist products to localStorage on every change
  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, loading]);

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

  const navigate = (page: Page) => {
    const from = PAGE_ORDER.indexOf(prevPageRef.current);
    const to = PAGE_ORDER.indexOf(page);
    setDirection(to >= from ? 1 : -1);
    prevPageRef.current = page;
    setCurrentPage(page);
  };

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

  // Product list management (add / delete / emoji update)
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
        />
      )}
    </div>
  );
};

export default App;
