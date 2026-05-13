const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => console.error('MongoDB connection error:', err));

// ============ MONGOOSE SCHEMAS ============

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['customer', 'kitchen', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: { type: Number, required: true },
  image: String,
  description: String,
  rating: { type: Number, default: 4.5 },
  available: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 15 },
  createdAt: { type: Date, default: Date.now }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    menuItemId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    specialInstructions: String
  }],
  tableNumber: Number,
  totalAmount: Number,
  gstAmount: Number,
  subtotal: Number,
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  orderType: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], default: 'dine-in' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: String,
  minThreshold: Number,
  supplier: String,
  lastRestocked: Date,
  updatedAt: { type: Date, default: Date.now }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

// Table Schema
const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: Number,
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
  currentOrderId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const Table = mongoose.model('Table', tableSchema);

// ============ AUTHENTICATION ROUTES ============

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    res.json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: 'Invalid role' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    res.json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ MIDDLEWARE - AUTH ============

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ MENU ROUTES ============

app.get('/api/menu', async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/menu', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const item = new MenuItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/menu/:id', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ORDER ROUTES ============

app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { items, tableNumber, totalAmount } = req.body;
    
    const subtotal = totalAmount / 1.05;
    const gstAmount = totalAmount - subtotal;

    const order = new Order({
      customerId: req.userId,
      items,
      tableNumber,
      totalAmount,
      subtotal,
      gstAmount,
      status: 'pending'
    });

    await order.save();

    // Update table status
    await Table.findOneAndUpdate(
      { tableNumber },
      { status: 'occupied', currentOrderId: order._id },
      { upsert: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.userId }).populate('customerId', 'email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/kitchen', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'kitchen') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const orders = await Order.find({
      status: { $in: ['pending', 'preparing'] }
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'kitchen') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });

    if (status === 'completed') {
      await Table.findOneAndUpdate(
        { _id: order.tableNumber },
        { status: 'available', currentOrderId: null }
      );
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ INVENTORY ROUTES ============

app.get('/api/inventory', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const item = new Inventory(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/inventory/:id', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const item = await Inventory.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ TABLE ROUTES ============

app.get('/api/tables', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tables', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const table = new Table(req.body);
    await table.save();
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ANALYTICS ROUTES ============

app.get('/api/analytics/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const totalOrders = await Order.countDocuments();
    const totalRevenue = (await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]))[0]?.total || 0;

    const activeOrders = await Order.countDocuments({ status: { $in: ['pending', 'preparing'] } });
    const tables = await Table.countDocuments();

    res.json({ totalOrders, totalRevenue, activeOrders, tables });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SERVER START ============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
