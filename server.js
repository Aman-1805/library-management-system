require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Connect to database and seed admin if empty
connectDB().then(async () => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            await Admin.create({ username: 'admin', password: hashedPassword });
            console.log('Initial admin seeded: admin / password123');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));

// Frontend View Routes (Shells for JWT Fetching)
app.get('/login', (req, res) => res.render('login'));
app.get('/', (req, res) => res.render('dashboard', { activeTab: 'dashboard' }));
app.get('/books', (req, res) => res.render('books', { activeTab: 'books' }));
app.get('/students', (req, res) => res.render('students', { activeTab: 'students' }));
app.get('/transactions', (req, res) => res.render('transactions', { activeTab: 'transactions' }));
app.get('/settings', (req, res) => res.render('settings', { activeTab: 'settings' }));

// Catch-all route 404
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
