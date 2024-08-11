// models/Finance.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FinanceSchema = new Schema({
  capital: Number,
  source: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Finance', FinanceSchema);