// src/routes/financeRoutes.js
import express from 'express';
import { getFinances, addFinance } from '../controllers/financeController.js';


const router = express.Router();

router.get('/', getFinances);
router.post('/', addFinance);

export default router;