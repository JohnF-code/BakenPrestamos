// routes/clients.js
import express from 'express';
const router = express.Router();
import Client from '../models/Client.js';
import authenticate from '../middleware/authenticate.js';
import User from '../models/User.js';

// Get all clients
router.get('/', authenticate, async (req, res) => {
  try {
    // Obtener id del usuario autenticado
    const { _id } = req.user.user;

    // Buscar al usuario autenticado
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Obtener los clientes que fueron creados por el usuario principal o cualquiera a los que tiene acceso
    const clients = await Client.find({
      createdBy: { $in: user.accessTo }
    });

    res.json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
});

// Add new client
router.post('/', authenticate, async (req, res) => {
  try {
    const { _id } = req.user.user;
    const client = new Client({...req.body, createdBy: _id });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.log(error.error);
    res.status(500).send('Hubo un error');
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Client.findOneAndDelete({
      _id: req.params.id
    });

    res.json({
      msg: 'Cliente Eliminado correctamente'
    });
  } catch (error) {
    console.log(error);
  }
})

router.put('/:id', authenticate, async (req, res) => { 
  try {
    const { id } = req.params;

    const newClient = await Client.findOneAndUpdate({ _id: id}, req.body);

    res.json({
      msg: 'Cliente Editado correctamente...'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Other routes for update and delete can be added here...

export default router;