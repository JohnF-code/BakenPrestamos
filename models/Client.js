// models/Client.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: String,
  contact: String,
  document: { type: String },
  date: { type: Date },
  coordinates: { type: [Number], required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

ClientSchema.index({ name: 'text' });

const Clients = mongoose.model('Client', ClientSchema);

export default Clients;