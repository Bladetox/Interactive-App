import React, { useState, useMemo } from 'react';
import imgRectangle6538 from "./assests/39a095c5219433210528f313f4db7ed09e8b6466.png";
import imgRectangle6539 from "./assests/c7319cef2b86a8f71b6765b77a10caccb7fc8b83.png";
import imgRectangle6540 from "./assests/1b41f753535d961cfbba08b0eb03a1902c09f7f3.png";
import imgRectangle6541 from "./assests/07e73d3701b2c2cf9a8054b1b2606088545c1b53.png";
import imgRectangle6542 from "./assests/345d9f75120e49e4b6f691447bccd48abfb67431.png";
import imgRectangle6543 from "./assests/28818bcf637e7596ffec2602b44c1b407fe11cf9.png";
import imgRectangle6544 from "./assests/d55ecea918fdfbe2d236a4386a73a981bf45f319.png";
import imgRectangle6545 from "./assests/464f20b81f02057b5cc69adbc19fb20af709c271.png";
import imgRectangle6546 from "./assests/365c8fc0f53d1bc2bad0988227099e87b4730cbc.png";
import imgRectangle6547 from "./assests/f286a5e73a18e796afd61d7b68c51addff2c69b6.png";

// Import all page components
import ProductListPage from './figma/ProductListPage';
import ProductDetailPage from './figma/ProductDetailPage';
import BasketPage from './components/BasketPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentPage from './figma/PaymentPage';
import ConfirmationPage from './components/ConfirmationPage';
import OrderConfirmationPage from './figma/OrderConfirmationPage';
import PlaceholderPage from './figma/PlaceholderPage';
import AddToCartOverlay from './figma/AddToCartOverlay';
import Menu from './figma/Menu';

// Enhanced product data with descriptions and locations
const PRODUCTS = [
  {
    id: 1,
    name: "Garlic clove",
    price: "$0.89 each",
    priceValue: 0.89,
    farm: "Kunisaki Farms",
    images: [imgRectangle6538, imgRectangle6539],
    isFavorite: false,
    description: "Bold, aromatic garlic cloves with a rich, complex flavor. Perfect for roasting, sautéing, or adding depth to any dish.",
    location: "Grown in Gilroy, CA by Kunisaki Farms",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 2,
    name: "Sugar snap pea",
    price: "$2.29/lb",
    priceValue: 2.29,
    farm: "Helmbolt Orchards",
    images: [imgRectangle6540, imgRectangle6539],
    isFavorite: false,
    description: "Crisp, sweet sugar snap peas with edible pods. Enjoy raw as a snack or lightly steamed to preserve their natural crunch.",
    location: "Grown in Salinas Valley, CA by Helmbolt Orchards",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 3,
    name: "Ginger",
    price: "$4.20/lb",
    priceValue: 4.20,
    farm: "Bui Farms",
    images: [imgRectangle6541],
    isFavorite: false,
    description: "Fresh, organic ginger root with a warm, spicy kick. Essential for Asian cooking and natural wellness remedies.",
    location: "Grown in Hawaii by Bui Farms",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 4,
    name: "Sweet onion",
    price: "$0.39/lb",
    priceValue: 0.39,
    farm: "Castelao Farms",
    images: [imgRectangle6542],
    isFavorite: false,
    description: "Mild, sweet onions perfect for caramelizing, grilling, or eating raw in salads and sandwiches.",
    location: "Grown in Walla Walla, WA by Castelao Farms",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 5,
    name: "Radish",
    price: "$1.99/bunch",
    priceValue: 1.99,
    farm: "Sunrise Valley Farm",
    images: [imgRectangle6543],
    isFavorite: false,
    description: "Crisp, peppery radishes with a satisfying crunch. Great for snacking, salads, or as a garnish.",
    location: "Grown in Vermont by Sunrise Valley Farm",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 6,
    name: "Celery",
    price: "$1.49/bunch",
    priceValue: 1.49,
    farm: "Green Acres",
    images: [imgRectangle6544],
    isFavorite: false,
    description: "Fresh, crunchy celery stalks perfect for snacking, soups, or as a base for countless recipes.",
    location: "Grown in Michigan by Green Acres",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 7,
    name: "Broccoli",
    price: "$2.49/head",
    priceValue: 2.49,
    farm: "Pacific Coast Farms",
    images: [imgRectangle6545],
    isFavorite: false,
    description: "Fresh broccoli crowns packed with nutrients. Excellent steamed, roasted, or added to stir-fries.",
    location: "Grown in Salinas, CA by Pacific Coast Farms",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 8,
    name: "Tomato",
    price: "$3.99/lb",
    priceValue: 3.99,
    farm: "Heritage Gardens",
    images: [imgRectangle6546],
    isFavorite: false,
    description: "Vine-ripened heirloom tomatoes bursting with flavor. Perfect for salads, sauces, or enjoying fresh.",
    location: "Grown in Sonoma, CA by Heritage Gardens",
    dietary: ["VG", "GF", "DF"]
  },
  {
    id: 9,
    name: "Bell pepper",
    price: "$1.29 each",
    priceValue: 1.29,
    farm: "Desert Sun Farms",
    images: [imgRectangle6547],
    isFavorite: false,
    description: "Sweet, colorful bell peppers with thick, crisp walls. Delicious raw, roasted, or stuffed.",
    location: "Grown in New Mexico by Desert Sun Farms",
    dietary: ["VG", "GF", "DF"]
  }
];

type Page = 'list' | 'detail' | 'basket' | 'checkout' | 'payment' | 'confirmation' | 'orderConfirmation' | 'placeholder';

interface CartItem {
  product: typeof PRODUCTS[0];
  quantity: number;
}

interface Order {
  items: CartItem[];
  total: number;
  deliveryMethod: string;
  deliveryTime: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState(PRODUCTS);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [addToCartProduct, setAddToCartProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.priceValue * item.quantity, 0), [cart]);

  const handleProductClick = (product: typeof PRODUCTS[0]) => {
    setSelectedProduct(product);
    setCurrentPage('detail');
  };

  const handleAddToCart = (product: typeof PRODUCTS[0], quantity: number = 1) => {
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
    setCurrentPage('orderConfirmation');
  };

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
            onBasketClick={() => setCurrentPage('basket')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'detail':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentPage('list')}
            onAddToCart={handleAddToCart}
            cartCount={cartCount}
            onBasketClick={() => setCurrentPage('basket')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        ) : null;
      case 'basket':
        return (
          <BasketPage
            items={cart}
            onBack={() => setCurrentPage('list')}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => setCurrentPage('checkout')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            items={cart}
            cartTotal={cartTotal}
            onBack={() => setCurrentPage('basket')}
            onContinue={() => setCurrentPage('payment')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'payment':
        return (
          <PaymentPage
            items={cart}
            cartTotal={cartTotal}
            onBack={() => setCurrentPage('checkout')}
            onOrderComplete={handleOrderComplete}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationPage
            onContinueShopping={() => setCurrentPage('list')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      case 'orderConfirmation':
        return completedOrder ? (
          <OrderConfirmationPage
            order={completedOrder}
            onContinueShopping={() => setCurrentPage('list')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        ) : null;
      case 'placeholder':
        return (
          <PlaceholderPage
            onBack={() => setCurrentPage('list')}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {renderPage()}
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
            setCurrentPage(page);
          }}
          cartCount={cartCount}
        />
      )}
    </div>
  );
};

export default App;
