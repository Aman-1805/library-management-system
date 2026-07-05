const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const adminExists = await Admin.findOne({ username });
        if (adminExists) return res.status(400).json({ error: 'Admin already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({
            _id: admin.id,
            username: admin.username,
            token: generateToken(admin._id)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const admin = await Admin.findOne({ username });
        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin.id,
                username: admin.username,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findById(req.adminId);

        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        if (username) {
            // Check if new username is already taken
            const existing = await Admin.findOne({ username });
            if (existing && existing._id.toString() !== req.adminId) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            admin.username = username;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
        }

        await admin.save();
        res.json({
            _id: admin.id,
            username: admin.username,
            token: generateToken(admin._id),
            message: 'Profile updated successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
