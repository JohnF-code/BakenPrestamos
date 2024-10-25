// src/routes/financeRoutes.js
import express from 'express';
import authenticate from '../middleware/authenticate.js';
import Bill from '../models/Bill.js';
import User from '../models/User.js';


const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        // Obtener id del usuario autenticado
        const { _id } = req.user.user;

        // Buscar al usuario autenticado
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtener los retiros que fueron creados por el usuario principal o cualquiera de los que tiene acceso
        const bills = await Bill.find({ createdBy: { $in: user.accessTo } });
        
        res.json(bills);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


router.post('/', authenticate, async (req, res) => {
    try {
        const { _id } = req.user.user;

        await Bill.create({ ...req.body, createdBy: _id });

        res.json({
            msg: 'Gasto agregado correctamente!'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deletedBill = await Bill.findOneAndDelete({ _id: req.params.id });

        res.json({
            msg: 'Gasto eliminado correctamente!',
            deletedBill
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

export default router;