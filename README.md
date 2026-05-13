# RestroHub - Smart Restaurant Management & QR Ordering System

A full-stack, production-grade restaurant management system built with modern web technologies. Perfect for college final-year projects and real-world implementations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-purple)

---

## 📋 Features

### 🛎️ **Customer Features**
- ✅ QR Code-based Menu Ordering
- ✅ Interactive Food Menu with Ratings
- ✅ Shopping Cart Management
- ✅ Real-time Order Tracking
- ✅ GST Billing Calculation
- ✅ Multiple Payment Methods Ready
- ✅ Responsive Mobile Interface

### 👨‍🍳 **Kitchen Staff Features**
- ✅ Real-time Order Queue
- ✅ Order Status Management (Pending → Preparing → Ready)
- ✅ Multi-table Order View
- ✅ Preparation Time Tracking
- ✅ Order History

### ⚙️ **Admin Dashboard**
- ✅ Analytics & Statistics
- ✅ Menu Management (CRUD Operations)
- ✅ Table Management
- ✅ Inventory Tracking
- ✅ Revenue Reports
- ✅ Order Management
- ✅ User Management

### 📊 **Technical Features**
- ✅ JWT Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ REST API Architecture
- ✅ MongoDB NoSQL Database
- ✅ Docker Containerization
- ✅ GitHub Actions CI/CD
- ✅ Environment Variables Configuration
- ✅ Error Handling & Validation

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** (optional) - HTTP Client

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **CORS** - Cross-origin Support

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse Proxy

---

## 📁 Project Structure

```
restaurant-management-system/
├── src/
│   ├── App.jsx                 # Main React component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/
│   └── favicon.ico
├── server.js                   # Express backend
├── package.json               # Backend dependencies
├── frontend-package.json      # Frontend dependencies
├── Dockerfile.backend         # Backend container
├── Dockerfile.frontend        # Frontend container
├── docker-compose.yml         # Container orchestration
├── nginx.conf                 # Nginx configuration
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── index.html                # HTML template
├── .env.example              # Environment template
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # GitHub Actions workflow
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS)
- Docker & Docker Compose
- Git
- VS Code (recommended)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/restaurant-management.git
cd restaurant-management

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Services will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

### Option 2: Local Development

**Backend Setup:**
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start MongoDB (ensure it's running)
# Update MONGODB_URI in .env if using local MongoDB

# Start backend server
npm run dev
# Backend runs at http://localhost:5000
```

**Frontend Setup (in new terminal):**
```bash
# Install dependencies
npm install --save-dev @vitejs/plugin-react vite tailwindcss postcss autoprefixer

# Start development server
npm run dev
# Frontend runs at http://localhost:3000
```

---

## 📝 API Documentation

### Authentication

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "customer" // customer, kitchen, admin
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}
```

### Menu

**GET /api/menu**
- Returns all menu items

**POST /api/menu** (Admin only)
```json
{
  "name": "Biryani",
  "category": "Main Course",
  "price": 250,
  "description": "Fragrant rice with spices",
  "rating": 4.5,
  "preparationTime": 15
}
```

### Orders

**POST /api/orders** (Authenticated)
```json
{
  "items": [
    {
      "menuItemId": "507f1f77bcf86cd799439011",
      "name": "Biryani",
      "price": 250,
      "quantity": 2
    }
  ],
  "tableNumber": 5,
  "totalAmount": 525
}
```

**GET /api/orders/kitchen** (Kitchen staff)
- Returns all pending and preparing orders

**PATCH /api/orders/:id/status** (Kitchen staff)
```json
{
  "status": "preparing" // pending, preparing, ready, completed, cancelled
}
```

### Inventory

**GET /api/inventory** (Admin only)

**POST /api/inventory** (Admin only)
```json
{
  "itemName": "Rice",
  "quantity": 50,
  "unit": "kg",
  "minThreshold": 10
}
```

### Tables

**GET /api/tables** (Admin only)

**POST /api/tables** (Admin only)
```json
{
  "tableNumber": 1,
  "capacity": 4
}
```

---

## 👥 Demo Credentials

### Customer
- **Email:** customer@example.com
- **Password:** password123
- **Role:** customer

### Kitchen Staff
- **Email:** kitchen@example.com
- **Password:** password123
- **Role:** kitchen

### Admin
- **Email:** admin@example.com
- **Password:** password123
- **Role:** admin

---

## 🗄️ MongoDB Collections

### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum: ['customer', 'kitchen', 'admin']),
  createdAt: Date
}
```

### MenuItems
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  price: Number,
  image: String,
  description: String,
  rating: Number,
  available: Boolean,
  preparationTime: Number,
  createdAt: Date
}
```

### Orders
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (ref: User),
  items: [{
    menuItemId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  tableNumber: Number,
  totalAmount: Number,
  gstAmount: Number,
  subtotal: Number,
  status: String (enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled']),
  paymentStatus: String (enum: ['unpaid', 'paid']),
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory
```javascript
{
  _id: ObjectId,
  itemName: String,
  quantity: Number,
  unit: String,
  minThreshold: Number,
  supplier: String,
  lastRestocked: Date,
  updatedAt: Date
}
```

### Tables
```javascript
{
  _id: ObjectId,
  tableNumber: Number (unique),
  capacity: Number,
  status: String (enum: ['available', 'occupied', 'reserved']),
  currentOrderId: ObjectId,
  createdAt: Date
}
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://mongo:27017/restaurant

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Payment Gateway
# STRIPE_KEY=pk_test_xxx
# RAZORPAY_KEY=xxx
```

---

## 🐳 Docker Commands

```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Rebuild specific service
docker-compose up -d --build backend
```

---

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test -- path/to/test.js

# With coverage
npm test -- --coverage
```

---

## 🔐 Security Considerations

1. **JWT Secret:** Change the default JWT_SECRET in production
2. **MongoDB Credentials:** Use strong passwords for MongoDB
3. **CORS:** Configure allowed origins properly
4. **Password Hashing:** Always use bcryptjs for passwords
5. **Environment Variables:** Never commit .env files
6. **HTTPS:** Use HTTPS in production
7. **Rate Limiting:** Implement rate limiting for APIs
8. **Input Validation:** Always validate user input

---

## 📈 Performance Optimization

- **Database Indexing:** Indexes on frequently queried fields
- **Caching:** Implement Redis for session caching
- **CDN:** Serve static assets from CDN in production
- **Lazy Loading:** React lazy loading for components
- **Image Optimization:** Compress images before serving
- **Database Connection Pooling:** Use MongoDB connection pools

---

## 🚀 Deployment

### Using Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create restaurant-management

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key

# Add MongoDB Atlas URL
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/restaurant

# Deploy
git push heroku main
```

### Using AWS

1. Set up EC2 instance
2. Install Docker and Docker Compose
3. Clone repository
4. Configure environment variables
5. Run `docker-compose up -d`
6. Set up CloudFront for static assets
7. Use RDS for MongoDB (or Atlas)

### Using DigitalOcean App Platform

1. Connect GitHub repository
2. Set up environment variables
3. Configure buildpack for Node.js
4. Deploy

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🐛 Troubleshooting

**Q: MongoDB Connection Error**
```
A: Ensure MongoDB is running and MONGODB_URI is correct
docker-compose logs mongo
```

**Q: Port Already in Use**
```
A: Change port in docker-compose.yml or kill process on port
lsof -i :5000  # Find process
kill -9 <PID>  # Kill process
```

**Q: CORS Errors**
```
A: Update CORS configuration in server.js
Check frontend API URL matches backend URL
```

**Q: Docker Build Fails**
```
A: Clear Docker cache
docker system prune -a
docker-compose build --no-cache
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📞 Support

For support, email support@restro-hub.com or open an issue in the repository.

---

## 🎯 Future Enhancements

- [ ] AI-powered food recommendations using ML
- [ ] Real-time notifications with WebSocket
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] QR code generation for menu
- [ ] SMS/Email notifications
- [ ] Customer loyalty program
- [ ] Advanced analytics dashboard
- [ ] Multi-restaurant support
- [ ] Mobile app (React Native)
- [ ] Voice ordering system
- [ ] Delivery partner integration
- [ ] Rating and review system

---

## 📊 Sample Demo Data

The system comes with pre-configured demo data:

**Menu Items:**
- Biryani (Main Course) - ₹250
- Paneer Tikka (Appetizer) - ₹180
- Tandoori Chicken (Main Course) - ₹320
- Butter Chicken (Main Course) - ₹280
- Naan (Bread) - ₹40
- Gulab Jamun (Dessert) - ₹80

**Tables:** 1-15 (Available)

**Demo Users:** 3 (Customer, Kitchen, Admin)

---

## 🎓 College Project Submission Checklist

- ✅ Full-stack implementation
- ✅ Database design with MongoDB
- ✅ RESTful API architecture
- ✅ Authentication & Authorization
- ✅ Responsive UI/UX
- ✅ Docker containerization
- ✅ CI/CD pipeline
- ✅ Comprehensive documentation
- ✅ Clean code structure
- ✅ Error handling
- ✅ Environment configuration
- ✅ Demo data included

---

**Last Updated:** January 2025

**Made with ❤️ for Restaurant Management Excellence**
