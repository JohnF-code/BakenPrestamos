// middleware/authenticate.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
  let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {

            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);

            const user = await User.findById(decoded.id).select('-password');
            
            req.user = {
                user,
                token
            };

            return next();
        } catch (error) {
            const e = new Error('Token no Válido');
            return res.status(403).json({ msg: e.message })
        }
    }

    if(!token) {
        const error = new Error('Token no Válido o inexistente');
        return res.status(403).json({ msg: error.message });
    }

    next();
};
