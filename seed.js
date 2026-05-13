const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// ============ SCHEMAS ============

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['customer', 'kitchen', 'admin'], required: true }
});

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: { type: Number, required: true },
  image: String,
  description: String,
  rating: { type: Number, default: 4.5 },
  available: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 15 }
});

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: String,
  minThreshold: Number,
  supplier: String
});

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: Number,
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' }
});

const User = mongoose.model('User', userSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const Table = mongoose.model('Table', tableSchema);

// ============ SEED DATA ============

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/restaurant', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Inventory.deleteMany({});
    await Table.deleteMany({});

    console.log('Cleared existing data');

    // -------- USERS --------
    const users = [
      {
        email: 'customer@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'John Customer',
        role: 'customer'
      },
      {
        email: 'kitchen@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Chef Smith',
        role: 'kitchen'
      },
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Admin User',
        role: 'admin'
      }
    ];

    await User.insertMany(users);
    console.log('✓ Users seeded');

    // -------- MENU ITEMS --------
    const menuItems = [
      {
        name: 'Biryani',
        category: 'Main Course',
        price: 250,
        image: '🍛',
        description: 'Fragrant basmati rice with aromatic spices and tender meat',
        rating: 4.8,
        available: true,
        preparationTime: 20
      },
      {
        name: 'Paneer Tikka',
        category: 'Appetizer',
        price: 180,
        image: '🔥',
        description: 'Grilled cottage cheese marinated in yogurt and spices',
        rating: 4.7,
        available: true,
        preparationTime: 12
      },
      {
        name: 'Tandoori Chicken',
        category: 'Main Course',
        price: 320,
        image: '🍗',
        description: 'Smoky grilled chicken cooked in traditional tandoor oven',
        rating: 4.9,
        available: true,
        preparationTime: 25
      },
      {
        name: 'Butter Chicken',
        category: 'Main Course',
        price: 280,
        image: '🍛',
        description: 'Creamy tomato-based curry with tender chicken pieces',
        rating: 4.8,
        available: true,
        preparationTime: 18
      },
      {
        name: 'Naan',
        category: 'Bread',
        price: 40,
        image: '🥘',
        description: 'Freshly baked traditional Indian bread',
        rating: 4.6,
        available: true,
        preparationTime: 8
      },
      {
        name: 'Roti',
        category: 'Bread',
        price: 30,
        image: '🥘',
        description: 'Whole wheat unleavened bread',
        rating: 4.5,
        available: true,
        preparationTime: 6
      },
      {
        name: 'Gulab Jamun',
        category: 'Dessert',
        price: 80,
        image: '🍩',
        description: 'Sweet milk solids in sugar syrup',
        rating: 4.9,
        available: true,
        preparationTime: 5
      },
      {
        name: 'Samosa',
        category: 'Appetizer',
        price: 60,
        image: '🥐',
        description: 'Crispy pastry filled with spiced potatoes',
        rating: 4.5,
        available: true,
        preparationTime: 10
      },
      {
        name: 'Chole Bhature',
        category: 'Main Course',
        price: 150,
        image: '🍱',
        description: 'Chickpeas curry with deep-fried bread',
        rating: 4.6,
        available: true,
        preparationTime: 15
      },
      {
        name: 'Raita',
        category: 'Side Dish',
        price: 50,
        image: '🥛',
        description: 'Yogurt-based cooling side dish',
        rating: 4.4,
        available: true,
        preparationTime: 5
      },
      {
        name: 'Mango Lassi',
        category: 'Beverage',
        price: 80,
        image: '🥤',
        description: 'Refreshing mango yogurt drink',
        rating: 4.7,
        available: true,
        preparationTime: 3
      },
      {
        name: 'Masala Chai',
        category: 'Beverage',
        price: 40,
        image: '☕',
        description: 'Traditional Indian spiced tea',
        rating: 4.5,
        available: true,
        preparationTime: 5
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('✓ Menu items seeded');

    // -------- INVENTORY --------
    const inventory = [
      {
        itemName: 'Basmati Rice',
        quantity: 100,
        unit: 'kg',
        minThreshold: 20,
        supplier: 'Punjab Rice Mills'
      },
      {
        itemName: 'Paneer (Cottage Cheese)',
        quantity: 50,
        unit: 'kg',
        minThreshold: 10,
        supplier: 'Local Dairy'
      },
      {
        itemName: 'Chicken (Boneless)',
        quantity: 75,
        unit: 'kg',
        minThreshold: 15,
        supplier: 'Fresh Chicken Co.'
      },
      {
        itemName: 'Yogurt',
        quantity: 80,
        unit: 'liters',
        minThreshold: 15,
        supplier: 'Local Dairy'
      },
      {
        itemName: 'Vegetables Mix',
        quantity: 120,
        unit: 'kg',
        minThreshold: 30,
        supplier: 'Fresh Produce Farm'
      },
      {
        itemName: 'Spice Mix',
        quantity: 20,
        unit: 'kg',
        minThreshold: 5,
        supplier: 'Spice Traders'
      },
      {
        itemName: 'Flour (Wheat)',
        quantity: 200,
        unit: 'kg',
        minThreshold: 50,
        supplier: 'Flour Mills'
      },
      {
        itemName: 'Ghee',
        quantity: 30,
        unit: 'liters',
        minThreshold: 5,
        supplier: 'Dairy Products Ltd'
      },
      {
        itemName: 'Oil',
        quantity: 40,
        unit: 'liters',
        minThreshold: 10,
        supplier: 'Oil Traders'
      },
      {
        itemName: 'Sugar',
        quantity: 50,
        unit: 'kg',
        minThreshold: 10,
        supplier: 'Sugar Mills'
      }
    ];

    await Inventory.insertMany(inventory);
    console.log('✓ Inventory seeded');

    // -------- TABLES --------
    const tables = [];
    for (let i = 1; i <= 15; i++) {
      tables.push({
        tableNumber: i,
        capacity: i % 2 === 0 ? 4 : 2,
        status: 'available'
      });
    }

    await Table.insertMany(tables);
    console.log('✓ Tables seeded');

    console.log('\n========================================');
    console.log('✓ Database seeding completed successfully!');
    console.log('========================================\n');

    console.log('Demo Credentials:');
    console.log('─────────────────────────────────────────');
    console.log('👤 Customer:');
    console.log('   Email: customer@example.com');
    console.log('   Password: password123\n');
    console.log('👨‍🍳 Kitchen Staff:');
    console.log('   Email: kitchen@example.com');
    console.log('   Password: password123\n');
    console.log('⚙️ Admin:');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
