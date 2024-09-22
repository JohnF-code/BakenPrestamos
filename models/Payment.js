// models/Payment.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  loanId: { type: Schema.Types.ObjectId, ref: 'Loan' },
  amount: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', PaymentSchema);