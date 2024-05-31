const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
    const { name, email, password, userName, phone, city, gender, age } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !userName) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
        const user = new User({ name, email, password, userName, phone, city, gender, age });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
