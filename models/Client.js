// models/Client.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: String,
  contact: String,
  document: { type: String },
  loanAmount: Number,
  interest: Number,
  installments: Number,
  balance: Number,
  installmentValue: Number,
  date: { type: Date },
  finishDate: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  terminated: { type: Boolean, default: false }
});

ClientSchema.index({ name: 'text' });

const Clients = mongoose.model('Client', ClientSchema);

export default Clients;