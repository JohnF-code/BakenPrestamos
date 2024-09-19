// models/Client.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LoanSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  loanAmount: Number,
  interest: Number,
  installments: Number,
  balance: Number,
  installmentValue: Number,
  description: String,
  date: { type: Date, default: Date.now() },
  finishDate: { type: Date },
  terminated: { type: Boolean, default: false }
});

LoanSchema.index({ name: 'text' });

const Loan = mongoose.model('Loan', LoanSchema);

export default Loan;