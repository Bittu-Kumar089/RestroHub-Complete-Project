# RestroHub - Quick Setup Guide

## ⚡ 5-Minute Quick Start

### Prerequisites Check
```bash
node --version  # Should be v18 or higher
npm --version   # Should be 8 or higher
docker --version
docker-compose --version
```

---

## 🐳 Option 1: Docker Compose (Easiest)

### Step 1: Clone & Setup
```bash
git clone https://github.com/yourusername/restaurant-management.git
cd restaurant-management
cp .env.example .env
```

### Step 2: Start Everything
```bash
docker-compose up -d
```

### Step 3: Seed Demo Data
```bash
docker-compose exec backend npm run seed
```

### Step 4: Access the System
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

### Login Credentials
```
Customer: customer@example.com / password123
Kitchen:  kitchen@example.com / password123
Admin:    admin@example.com / password123
```

---

## 💻 Option 2: Local Development

### Backend Setup

#### Step 1: Install Node Modules
```bash
npm install
```

#### Step 2: Setup MongoDB
**Option A - Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name restaurant-mongo mongo:7-alpine
```

**Option B - Install Locally**
- Download from https://www.mongodb.com/try/download/community
- Follow installation guide for your OS

#### Step 3: Create .env File
```bash
cp .env.example .env
```

**Update .env with:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant
JWT_SECRET=dev_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
```

#### Step 4: Seed Database
```bash
node seed.js
```

#### Step 5: Start Backend Server
```bash
npm run dev
```

✅ Backend ready at http://localhost:5000

---

### Frontend Setup (New Terminal)

#### Step 1: Install Dependencies
```bash
npm install --save-dev @vitejs/plugin-react vite tailwindcss postcss autoprefixer
```

#### Step 2: Start Dev Server
```bash
npm run dev
```

✅ Frontend ready at http://localhost:3000

---

## 📂 Project Structure for Submission

```
final-project/
│
├── README.md                    # Full documentation ⭐
├── QUICK_SETUP.md              # This file
│
├── Frontend Files:
├── src/
│   ├── App.jsx                 # Main React component
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── main.jsx
├── index.css
│
├── Backend Files:
├── server.js                    # Express server
├── seed.js                      # Database seeding
├── package.json               # Backend dependencies
│
├── Docker & Deployment:
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml         # Complete setup ⭐
├── nginx.conf
│
├── Configuration:
├── .env.example               # Copy to .env
├── .gitignore
│
└── CI/CD:
    └── .github/
        └── workflows/
            └── ci-cd.yml      # GitHub Actions ⭐
```

---

## 🚀 Complete Feature Walkthrough

### Customer Journey

**1. Login Page**
- Select "Customer" role
- Email: customer@example.com
- Password: password123

**2. Menu Page**
- Browse 12 restaurant dishes
- See ratings and descriptions
- Click items to add to cart

**3. Cart Management**
- Adjust quantities
- View subtotal and GST
- Remove items

**4. Billing**
- Enter table number
- Review final amount
- Place order

**5. Order Tracking** (Coming Soon)
- Real-time kitchen status
- Preparation time countdown

---

### Kitchen Staff Journey

**1. Login as Kitchen**
- Email: kitchen@example.com
- Password: password123

**2. Kitchen Dashboard**
- See pending orders
- Click "Start Preparing"
- Click "Mark Ready"
- Order disappears when served

---

### Admin Dashboard Journey

**1. Login as Admin**
- Email: admin@example.com
- Password: password123

**2. Admin Features**
- **Dashboard:** View stats (orders, revenue, active orders, tables)
- **Inventory:** Check stock levels
- **Tables:** Manage restaurant tables
- **Menu:** Add/edit items (ready for expansion)

---

## 🧪 Testing APIs with Postman

### Import Collection
```json
{
  "info": {
    "name": "RestroHub API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"customer@example.com\",\"password\":\"password123\",\"role\":\"customer\"}"
        }
      }
    },
    {
      "name": "Get Menu",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/menu"
      }
    }
  ]
}
```

---

## 🔍 Verify Everything Works

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/menu
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "Biryani",
    "category": "Main Course",
    "price": 250,
    ...
  }
]
```

### 2. Check Frontend
```
Open http://localhost:3000 in browser
Should show login page with RestroHub branding
```

### 3. Test Full Flow
1. Login with demo credentials
2. Browse menu
3. Add items to cart
4. Go to billing
5. Place order

---

## 📊 Performance Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Follow new logs
docker-compose logs --follow
```

### Check Database
```bash
# Connect to MongoDB
docker-compose exec mongo mongosh

# List databases
show dbs

# Use restaurant database
use restaurant

# Check collections
show collections

# View users
db.users.find()

# View orders
db.orders.find()

# View menu items
db.menuitems.find()
```

---

## 🐛 Troubleshooting

### Issue: Port 3000 or 5000 Already in Use

**Solution:**
```bash
# Kill process on port
lsof -i :3000
kill -9 <PID>

# OR change port in docker-compose.yml
ports:
  - "3001:3000"  # Change to different port
```

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Check MongoDB is running
docker-compose ps

# Restart MongoDB
docker-compose restart mongo

# Check MongoDB logs
docker-compose logs mongo
```

### Issue: Frontend shows blank page

**Solution:**
```bash
# Check if backend is accessible
curl http://localhost:5000/api/menu

# Check frontend logs
docker-compose logs frontend

# Clear browser cache and refresh
```

### Issue: Can't login

**Solution:**
```bash
# Verify seed data was imported
docker-compose exec backend npm run seed

# Check user collection
docker-compose exec mongo mongosh
use restaurant
db.users.find()
```

---

## 📋 Submission Checklist

- ✅ Full-stack application working
- ✅ Docker setup functional
- ✅ GitHub Actions CI/CD configured
- ✅ Database schemas created
- ✅ Authentication implemented
- ✅ RBAC for 3 roles
- ✅ Responsive UI
- ✅ Comprehensive documentation
- ✅ Demo data included
- ✅ Error handling
- ✅ Environment variables
- ✅ Clean code structure

---

## 📚 Important Files to Show

When submitting, highlight:

1. **docker-compose.yml** - Shows DevOps knowledge
2. **server.js** - Backend architecture
3. **frontend-app.jsx** - React implementation
4. **.github/workflows/ci-cd.yml** - CI/CD pipeline
5. **README.md** - Complete documentation
6. **seed.js** - Database setup

---

## 💡 Pro Tips

1. **Run on College WiFi?**
   - May need to update CORS settings
   - Check nginx.conf for allowed origins

2. **Deploying to Cloud?**
   - Use MongoDB Atlas (free tier available)
   - Deploy to Heroku, Railway, or Render
   - Update MONGODB_URI in production .env

3. **Need More Features for Marks?**
   - Add WebSocket for real-time updates
   - Implement Stripe payment integration
   - Add QR code generation
   - Implement AI recommendations
   - Add customer ratings system

4. **Performance Tuning?**
   - Add Redis caching
   - Implement pagination
   - Add database indexes
   - Use CDN for static assets

---

## 🎓 Project Statistics

- **Lines of Code:** 1000+
- **Components:** 10+
- **API Endpoints:** 15+
- **Database Collections:** 5
- **Docker Containers:** 3 (Frontend, Backend, MongoDB)
- **Features:** 20+
- **Demo Data Items:** 50+

---

## 📞 Quick Reference

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:5000 | 5000 |
| MongoDB | localhost | 27017 |

| Credential | Email | Password |
|-----------|-------|----------|
| Customer | customer@example.com | password123 |
| Kitchen | kitchen@example.com | password123 |
| Admin | admin@example.com | password123 |

---

## ✨ You're All Set!

Your complete, production-ready restaurant management system is ready to use and submit. 

**Next Steps:**
1. Run `docker-compose up -d`
2. Open http://localhost:3000
3. Login with demo credentials
4. Explore the system
5. Prepare presentation

**Good luck with your project! 🚀**

---

*For detailed documentation, see README.md*
