import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();
import User from "../models/User.js";
import authenticate from '../middleware/authenticate.js';

router.post('/register', async (req, res) => {

    try {
        const { name, email, role, password } = req.body;

        const encryptedPassword = bcrypt.hashSync(password, 10);

        const newUser = {
            name,
            email,
            password: encryptedPassword,
            role
        }

        const user = await User.create(newUser);

        const toSend = {
            status: 'success',
            data: user
        }

        res.status(200).json(toSend);
    } catch (error) {
        console.log('ERROR - REGISTER ENDPOINT');
        console.log(error);

        const toSend = {
            status: 'error',
            error
        };

        res.status(500).json(toSend);
    }
});

router.get('/profile', authenticate, (req, res) => {
    const { user } = req.user;
    console.log({ user, token: req.user.token });
    res.json({ user, token: req.user.token });
})

router.get('/', authenticate, async (req, res) => {
    
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error)
    }
});

router.delete('/admin/:id', authenticate, async (req, res) => {
    
    try {
        const { id } = req.params;
        await User.findOneAndDelete({ _id: id });
        res.json({
            msg: 'Usuario Eliminado correctamente'
        });
    } catch (error) {
        console.log(error)
    }
});

export default router;