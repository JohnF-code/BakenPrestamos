// models/Bills.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const WithdrawalsSchema = new Schema({
  name: String,
  amount: { type: Number },
  date: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Withdrawal = mongoose.model('Withdrawal', WithdrawalsSchema);

export default Withdrawal;