#!/usr/bin/env node

# Shehri Awaaz - Setup Script

echo "🚀 Shehri Awaaz - Civic Issue Reporting System"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✓ Backend dependencies installed"
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✓ Frontend dependencies installed"
echo ""

cd ..

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Copy backend/.env.example to backend/.env"
echo "  2. Open two terminals"
echo "  3. In terminal 1: cd backend && npm run dev"
echo "  4. In terminal 2: cd frontend && npm run dev"
echo "  5. Open http://localhost:5173 in your browser"
echo ""
