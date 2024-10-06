import Finance from '../models/Finance.js';
import User from '../models/User.js';

export const getFinances = async (req, res) => {
  try {
    // Obtener id del usuario autenticado
    const { _id } = req.user.user;

    // Buscar al usuario autenticado
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const finances = await Finance.find({
      createdBy: { $in: user.accessTo }
    });

    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las finanzas" });
  }
};

export const addFinance = async (req, res) => {
  try {
    const { _id } = req.user.user;
    const newFinance = new Finance({...req.body, createdBy: _id });
    await newFinance.save();
    res.status(201).json(newFinance);
  } catch (error) {
    res.status(500).json({ message: "Error al añadir financiamiento" });
  }
};