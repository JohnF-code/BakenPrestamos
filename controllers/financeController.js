import Finance from '../models/Finance.js';

export const getFinances = async (req, res) => {
  try {
    const finances = await Finance.find();
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las finanzas" });
  }
};

export const addFinance = async (req, res) => {
  try {
    const newFinance = new Finance(req.body);
    await newFinance.save();
    res.status(201).json(newFinance);
  } catch (error) {
    res.status(500).json({ message: "Error al añadir financiamiento" });
  }
};