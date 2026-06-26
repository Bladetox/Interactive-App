import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ProductListPage from './figma/ProductListPage';
import ProductDetailPage from './figma/ProductDetailPage';
import BasketPage from './components/BasketPage';
import ConfirmationPage from './components/ConfirmationPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentPage from './figma/PaymentPage';
import OrderConfirmationPage from './figma/OrderConfirmationPage';
import PlaceholderPage from './figma/PlaceholderPage';
import AddToCartOverlay from './components/AddToCartOverlay';
import Menu from './figma/Menu';
import { DEFAULT_DELIVERY, DeliveryOption } from './shared/deliveryTypes';
import { categoryEmoji, defaultEmoji } from './shared/categoryEmoji';

// ── Types ──────────────────────────────────────────────────────────────────
export type Page = 'list' | 'detail' | 'basket' | 'confirmation' | 'checkout' | 'payment' | 'orderConfirmation' | 'placeholder';

export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  category: string;
  available: boolean;
  images: string[];
  isFavorite: boolean;
  description: string;
  location: string;
  dietary: string[];
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

// ── Page transition helpers ────────────────────────────────────────────────
const PAGE_ORDER: Page[] = [
  'list', 'detail', 'basket', 'confirmation', 'checkout', 'payment', 'orderConfirmation'
];

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 35 },
      opacity: { duration: 0.22 },
      scale: { duration: 0.22 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 35 },
      opacity: { duration: 0.18 },
      scale: { duration: 0.18 },
    },
  }),
};

// ── App ────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [direction, setDirection] = useState(1);
  const prevPageRef = useRef<Page>('list');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [addToCartProduct, setAddToCartProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(DEFAULT_DELIVERY);

  // Fetch prices.json at runtime
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}prices.json`)
      .then(r => r.json())
      .then((data: { items: Array<{ id: number; name: string; price: number; category: string; available: boolean }> }) => {
        const mapped: Product[] = data.items.map(item => ({
          id: item.id,
          name: item.name,
          price: `R${item.price.toFixed(2)}`,
          priceValue: item.price,
          category: item.category,
          available: item.available,
          images: [],
          isFavorite: false,
          description: '',
          location: '',
          dietary: [],
        }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.priceValue * item.quantity, 0), [cart]);

  const confirmationCartItems = useMemo(() =>
    cart.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      priceValue: item.product.priceValue,
      image: categoryEmoji[item.product.name] ?? defaultEmoji,
      quantity: item.quantity,
    })),
  [cart]);

  const navigate = (page: Page) => {
    const fromIdx = PAGE_ORDER.indexOf(prevPageRef.current);
    const toIdx = PAGE_ORDER.indexOf(page);
    setDirection(toIdx >= fromIdx ? 1 : -1);
    prevPageRef.current = page;
    setCurrentPage(page);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate('detail');
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setAddToCartProduct(product);
    setShowAddToCart(true);
    setTimeout(() => setShowAddToCart(false), 2000);
  };

  const handleToggleFavorite = (productId: number) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleOrderComplete = (order: Order) => {
    setCompletedOrder(order);
    setCart([]);
    setSelectedDelivery(DEFAULT_DELIVERY);
    navigate('orderConfirmation');
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
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            cartCount={cartCount}
            onBasketClick={() => navigate('basket')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'detail':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => navigate('list')}
            onAddToCart={handleAddToCart}
            cartCount={cartCount}
            onCartClick={() => navigate('basket')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        ) : null;
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
      case 'placeholder':
        return (
          <PlaceholderPage
            onBack={() => navigate('list')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
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
        <AddToCartOverlay
          product={addToCartProduct}
          onClose={() => setShowAddToCart(false)}
        />
      )}
      {isMenuOpen && (
        <Menu
          onClose={() => setIsMenuOpen(false)}
          onNavigate={(page: Page) => {
            setIsMenuOpen(false);
            navigate(page);
          }}
          cartCount={cartCount}
        />
      )}
    </div>
  );
};

export default App;
