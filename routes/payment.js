// routes/payments.js
import express from 'express';
const router = express.Router();
import Payment from '../models/Payment.js';
import Client from '../models/Client.js';
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

    const updatedClient = await Client.findOneAndUpdate({ _id: clientId }, { balance: updatedBalance });

    console.log('=======', updatedBalance);
    // Verificar si la deuda del cliente ya ha terminado
    if (updatedBalance <= 1000) {
      const terminatedClient = await Client.findOneAndUpdate({ _id: clientId }, {
        terminated: true
      });
      //  Mandar respuesta al frontend
      res.status(201).json({
        terminatedClient,
        msg: `Felicidades, el usuario ${terminatedClient.name} ha culminado con su prestamo`
      });
      return;
    }

    //  Mandar respuesta al frontend
    res.status(201).json({
      updatedClient,
      msg: 'Pago registrado con exito!'
    });
  } catch (error) {
    console.log(error);
  }
});

// Other routes for update and delete can be added here...

export default router;