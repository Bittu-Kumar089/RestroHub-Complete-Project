import React, { useState, useEffect } from 'react';
import { QrCode, LogOut, Home, Users, UtensilsCrossed, Zap, BarChart3, DollarSign, Package, Menu as MenuIcon, X, ShoppingCart, Plus, Minus, Truck } from 'lucide-react';

// Mock API calls (replace with real API in production)
const API_BASE = 'http://localhost:5000/api';

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
          
          {/* Role Selection */}
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

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all hover:shadow-xl transform hover:scale-105"
          >
            Sign In
          </button>

          {/* Demo Credentials */}
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

// Navigation Bar
const Navbar = ({ role, onLogout }) => {
  const navItems = {
    customer: [
      { icon: Home, label: 'Menu', key: 'menu' },
      { icon: ShoppingCart, label: 'Cart', key: 'cart' },
      { icon: QrCode, label: 'QR Order', key: 'qr' }
    ],
    kitchen: [
      { icon: Zap, label: 'Orders', key: 'kitchen' }
    ],
    admin: [
      { icon: BarChart3, label: 'Dashboard', key: 'dashboard' },
      { icon: Package, label: 'Inventory', key: 'inventory' },
      { icon: Users, label: 'Tables', key: 'tables' }
    ]
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

// Menu Page
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
      // Demo data
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

// Cart Page
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
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-bold w-24 text-right">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3 mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>GST (5%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-600 pt-3 flex justify-between text-white font-bold text-lg">
                <span>Total:</span>
                <span className="text-amber-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('billing')}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
            >
              Proceed to Billing
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Billing Page
const BillingPage = ({ cart, setCurrentPage }) => {
  const [tableNo, setTableNo] = useState('1');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(total * 0.05 * 100) / 100;
  const grandTotal = total + gst;

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          tableNumber: tableNo,
          totalAmount: grandTotal
        })
      });
      if (res.ok) {
        alert('Order placed successfully!');
        setCurrentPage('menu');
      }
    } catch (err) {
      console.error('Order error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Billing</h1>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 space-y-6">
          <div>
            <label className="block text-slate-300 font-semibold mb-3">Table Number</label>
            <input
              type="number"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-bold text-lg mb-3">Order Summary</h3>
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-slate-300">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-600 pt-4 space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>GST (5%):</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Grand Total:</span>
              <span className="text-amber-400">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
          >
            Place Order & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

// Kitchen Dashboard
const KitchenPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/orders/kitchen`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      // Demo data
      setOrders([
        { _id: '1', tableNumber: 5, items: [{ name: 'Biryani', quantity: 2 }], status: 'pending', createdAt: new Date().toISOString() },
        { _id: '2', tableNumber: 8, items: [{ name: 'Butter Chicken', quantity: 1 }], status: 'preparing', createdAt: new Date().toISOString() }
      ]);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Kitchen Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`p-6 rounded-xl border transition-all ${
                order.status === 'pending'
                  ? 'bg-red-900/20 border-red-500/50'
                  : order.status === 'preparing'
                  ? 'bg-yellow-900/20 border-yellow-500/50'
                  : 'bg-green-900/20 border-green-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-bold text-xl">Table {order.tableNumber}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'pending'
                    ? 'bg-red-500 text-white'
                    : order.status === 'preparing'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-green-500 text-white'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-slate-300">
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    • {item.name} x{item.quantity}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-all"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'ready')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <div className="text-green-400 font-bold text-center py-2">✓ Ready for Pickup</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 24, totalRevenue: 8500, activeOrders: 5, tables: 15 });

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: Truck },
            { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign },
            { label: 'Active Orders', value: stats.activeOrders, icon: Zap },
            { label: 'Total Tables', value: stats.tables, icon: Users }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-white text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-10 h-10 text-amber-400 opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart placeholder */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">Revenue Trend</h2>
          <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center text-slate-400">
            Chart visualization would go here
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [role, setRole] = useState(null);
  const [cart, setCart] = useState([]);

  const handleLogin = (userRole) => {
    setRole(userRole);
    setCurrentPage(userRole === 'customer' ? 'menu' : userRole === 'kitchen' ? 'kitchen' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setRole(null);
    setCurrentPage('login');
    setCart([]);
  };

  if (!role) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar role={role} onLogout={handleLogout} />
      <div className="bg-slate-950 min-h-screen">
        {role === 'customer' && currentPage === 'menu' && <MenuPage setCurrentPage={setCurrentPage} setCart={setCart} />}
        {role === 'customer' && currentPage === 'cart' && <CartPage cart={cart} setCart={setCart} setCurrentPage={setCurrentPage} />}
        {role === 'customer' && currentPage === 'billing' && <BillingPage cart={cart} setCurrentPage={setCurrentPage} />}
        {role === 'kitchen' && <KitchenPage />}
        {role === 'admin' && <AdminDashboard />}
      </div>
    </>
  );
}
