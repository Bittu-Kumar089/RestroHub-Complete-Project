import React, { useState, useEffect } from 'react';
import { QrCode, LogOut, Home, Users, UtensilsCrossed, Zap, BarChart3, DollarSign, Package, Menu as MenuIcon, X, ShoppingCart, Plus, Minus, Truck } from 'lucide-react';

// API base path uses Vite proxy during development
const API_BASE = '/api';

// ============ COMPONENTS ============

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', data.userId);
        onLogin(role);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">RestroHub</h1>
          <p className="text-slate-400 text-sm">Smart Restaurant Management System</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleLogin} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-3">Login As</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'customer', label: 'Customer', icon: '🛎️' },
                { value: 'kitchen', label: 'Kitchen', icon: '👨‍🍳' },
                { value: 'admin', label: 'Admin', icon: '⚙️' }
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    role === option.value
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span className="text-lg block mb-1">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all hover:shadow-xl transform hover:scale-105"
          >
            Sign In
          </button>

          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-slate-200">Demo Credentials:</p>
            <p>👤 Customer: customer@example.com / password123</p>
            <p>👨‍🍳 Kitchen: kitchen@example.com / password123</p>
            <p>⚙️ Admin: admin@example.com / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

const Navbar = ({ role, onLogout }) => {
  const navItems = {
    customer: [
      { icon: Home, label: 'Menu', key: 'menu' },
      { icon: ShoppingCart, label: 'Cart', key: 'cart' },
      { icon: QrCode, label: 'QR Order', key: 'qr' }
    ],
    kitchen: [
      { icon: Zap, label: 'Orders', key: 'kitchen' }],
    admin: [
      { icon: BarChart3, label: 'Dashboard', key: 'dashboard' },
      { icon: Package, label: 'Inventory', key: 'inventory' },
      { icon: Users, label: 'Tables', key: 'tables' }]
  };

  return (
    <nav className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-amber-400" />
            <span className="text-white font-bold text-lg">RestroHub</span>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-300 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const MenuPage = ({ setCurrentPage, setCart }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_BASE}/menu`);
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      setMenu([
        { _id: '1', name: 'Biryani', category: 'Main Course', price: 250, image: '🍛', rating: 4.5, description: 'Fragrant rice with spices' },
        { _id: '2', name: 'Paneer Tikka', category: 'Appetizer', price: 180, image: '🔥', rating: 4.8, description: 'Grilled cottage cheese' },
        { _id: '3', name: 'Tandoori Chicken', category: 'Main Course', price: 320, image: '🍗', rating: 4.6, description: 'Smoky grilled chicken' },
        { _id: '4', name: 'Butter Chicken', category: 'Main Course', price: 280, image: '🍛', rating: 4.7, description: 'Creamy tomato-based curry' },
        { _id: '5', name: 'Naan', category: 'Bread', price: 40, image: '🥘', rating: 4.4, description: 'Freshly baked bread' },
        { _id: '6', name: 'Gulab Jamun', category: 'Dessert', price: 80, image: '🍩', rating: 4.9, description: 'Sweet milk solids' }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Our Menu</h1>
          <p className="text-slate-400">Discover our finest dishes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item) => (
            <div
              key={item._id}
              className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-amber-400/50 transition-all group cursor-pointer"
              onClick={() => {
                setCart(prev => [...prev, { ...item, quantity: 1 }]);
                setCurrentPage('cart');
              }}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.image}</div>
              <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-slate-400 text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold text-lg">₹{item.price}</span>
                <span className="text-slate-400 text-sm">⭐ {item.rating}</span>
              </div>
              <div className="mt-4 bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 rounded-lg text-white text-sm font-semibold text-center">
                Add to Cart
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, setCart, setCurrentPage }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(total * 0.05 * 100) / 100;
  const grandTotal = total + gst;

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item =>
      item._id === id
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item._id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{item.image}</span>
                  <div>
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <p className="text-amber-400">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => updateQuantity(item._id, -1)} className="bg-slate-700 rounded-full p-2 text-slate-200">-</button>
                  <span className="text-white">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item._id, 1)} className="bg-slate-700 rounded-full p-2 text-slate-200">+</button>
                </div>
              </div>
            ))}

            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 text-slate-200">
              <div className="flex justify-between mb-3"><span>Subtotal</span><span>₹{total}</span></div>
              <div className="flex justify-between mb-3"><span>GST (5%)</span><span>₹{gst}</span></div>
              <div className="flex justify-between font-semibold text-white text-lg"><span>Total</span><span>₹{grandTotal}</span></div>
            </div>

            <button onClick={() => setCurrentPage('menu')} className="w-full bg-amber-500 text-slate-950 font-bold rounded-xl py-3 hover:bg-amber-400 transition-all">Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [currentPage, setCurrentPage] = useState('menu');
  const [cart, setCart] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setRole(null);
  };

  if (!role) {
    return <LoginPage onLogin={setRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar role={role} onLogout={handleLogout} />
      {currentPage === 'menu' && <MenuPage setCurrentPage={setCurrentPage} setCart={setCart} />}
      {currentPage === 'cart' && <CartPage cart={cart} setCart={setCart} setCurrentPage={setCurrentPage} />}
      {currentPage !== 'cart' && currentPage !== 'menu' && (
        <div className="p-6 text-slate-300">Page not implemented yet.</div>
      )}
    </div>
  );
};

export default App;
