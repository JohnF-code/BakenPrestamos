// routes/payments.js
import express from 'express';
const router = express.Router();
import Payment from '../models/Payment.js';
import Loan from '../models/Loan.js';
import authenticate from '../middleware/authenticate.js';

// Get all payments
router.get('/', authenticate, async (req, res) => {
  const payments = await Payment.find().populate('clientId');
  res.json(payments);
});

// Add new payment
router.post('/', authenticate, async (req, res) => {
  try {
    const { balance, clientId } = req.body;

    // Registrar pago
    const payment = new Payment(req.body);
    await payment.save();

    console.log(payment);

    // Actualizar Cantidad
    const updatedBalance = balance - payment.amount;

    const updatedLoan = await Loan.findOneAndUpdate({ clientId }, { balance: updatedBalance });

    console.log('=======', updatedBalance);
    // Verificar si la deuda del cliente ya ha terminado
    if (updatedBalance <= 1000) {
      const terminatedLoan = await Loan.findOneAndUpdate({ clientId }, {
        terminated: true
      }).populate('clientId');
      //  Mandar respuesta al frontend
      res.status(201).json({
        terminatedLoan,
        msg: `Felicidades, el usuario ${terminatedLoan?.clientId?.name || ''} ha culminado con su prestamo`
      });
      return;
    }

    //  Mandar respuesta al frontend
    res.status(201).json({
      updatedLoan,
      msg: 'Pago registrado con exito!'
    });
  } catch (error) {
    console.log(error);
  }
});

// Other routes for update and delete can be added here...

export default router;