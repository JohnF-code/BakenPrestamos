// models/Bills.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BillsSchema = new Schema({
  description: String,
  amount: { type: Number },
  date: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Bill = mongoose.model('Bill', BillsSchema);

export default Bill;