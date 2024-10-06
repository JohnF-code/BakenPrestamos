// routes/clients.js
import express from 'express';
const router = express.Router();
import Loan from '../models/Loan.js';
import authenticate from '../middleware/authenticate.js';
import Clients from '../models/Client.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

// Get all Loans
router.get('/', authenticate, async (req, res) => {
  try {
    // Obtener id del usuario autenticado
    const { _id } = req.user.user;

    // Buscar al usuario autenticado
    const user = await User.findById(_id);

    // Obtener los prestamos que fueron creados por el usuario principal o cualquiera a los que tiene acceso
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Obtener los prestamos que fueron creados por el usuario principal o cualquiera a los que tiene acceso
    const loans = await Loan.find({
      createdBy: { $in: user.accessTo }
    }).populate('clientId');

    res.json(loans);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
});

// Get Loans By client
router.get('/:id', authenticate, async (req, res) => {
  
  const { id } = req.params;
  try {
    // Obtener id del usuario autenticado
    const { _id } = req.user.user;

    // Buscar al usuario autenticado
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Obtener el prestamo que fue creado por el usuario principal o cualquiera a los que tiene acceso
    const loans = await Loan.find({
      clientId: id,
      createdBy: { $in: user.accessTo }
    }).populate('clientId');
  
    res.json(loans);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
});

// Add new loan
router.post('/', authenticate, async (req, res) => {
  try {
    const { _id } = req.user.user;
    const loan = new Loan({...req.body, createdBy: _id });
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    console.log(error.error);
    res.status(500).send('Hubo un error');
  }
});

// Delete loan...
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Loan.findOneAndDelete({ _id: req.params.id });

    const deletedPayments = await Payment.deleteMany({ loanId: req.params.id });
    console.log(deletedPayments);
    res.json({
      msg: 'Prestamo Eliminado correctamente',
      deletedPayments
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Update Loan...
router.put('/:id', async (req, res) => {
  try {
    const updated = await Loan.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.json({
      msg: 'Prestamo Editado correctamente...',
      updated
    })
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
})

export default router;