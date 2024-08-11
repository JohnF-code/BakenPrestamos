// routes/clients.js
import express from 'express';
const router = express.Router();
import Client from '../models/Client.js';
import authenticate from '../middleware/authenticate.js';

// Get all clients
router.get('/', authenticate, async (req, res) => {
  console.log('Consultaste Clients');
  const { search } = req.query;
  try {
    if (search) {
      // Si hay una busqueda
      const clients = await Client.find({ $text: { $search: search } })
      return res.json(clients);
    }
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
});

// Add new client
router.post('/', authenticate, async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.log(error.error);
    res.status(500).send('Hubo un error');
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Client.findOneAndDelete({ _id: req.params.id });

    res.json({
      msg: 'Cliente Eliminado correctamente'
    });
  } catch (error) {
    console.log(error);
  }
})

// Other routes for update and delete can be added here...

export default router;