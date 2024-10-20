// src/routes/financeRoutes.js
import express from 'express';
import { getFinances, addFinance, deleteFinance } from '../controllers/financeController.js';
import authenticate from '../middleware/authenticate.js';


const router = express.Router();

router.get('/', authenticate, getFinances);
router.post('/', authenticate, addFinance);
router.delete('/:id', authenticate, deleteFinance);

export default router;