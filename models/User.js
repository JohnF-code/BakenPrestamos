// models/User.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['cobrador', 'finanzas', 'administrador'], required: true }
});

export default mongoose.model('User', UserSchema);