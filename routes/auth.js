// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

import User from '../models/User.js';

// Login
router.post('/login', async (req, res) => {
 try {
    const { email, password } = req.body;
   
    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET, { expiresIn: '1h' });
    res.json({ user, token });
 } catch (error) {
    console.log(error);
    res.status(501).send('Hubo un error!')
 }
});

export default router;