// models/User.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['cobrador', 'finanzas', 'administrador'], required: true },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia a otro usuario que creó este usuario (sub-usuario)
      default: null
  },
  createdUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Sub-usuarios creados por este usuario
  }],
  accessTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Lista de usuarios a los que puede acceder (solo sub-usuarios)
  }]
}, {
  timestamps: true
});

UserSchema.pre('save', function(next) {
    if (!this.createdBy && !this.accessTo.includes(this._id)) {
        // Si el usuario no fue creado por otro (es un usuario principal), añadir su propio ID a accessTo
        this.accessTo.push(this._id);
    }
    next();
});

// Método para agregar sub-usuario
UserSchema.methods.addSubUser = async function(subUserData) {
    const subUser = new this.constructor(subUserData);
    subUser.createdBy = this._id;
    subUser.accessTo = [subUser._id, ...this.accessTo]; // El sub-usuario solo puede acceder a los datos del usuario principal
    await subUser.save();
    this.createdUsers.push(subUser._id); // Guardar referencia del sub-usuario en el usuario principal
    this.accessTo.push(subUser._id);
    await this.save();
    return subUser;
};

// Método para verificar si el usuario tiene acceso a los datos de otro usuario
UserSchema.methods.canAccessData = function(targetUserId) {
    return this.accessTo.includes(targetUserId);
};

// Método para verificar permisos según el rol
UserSchema.methods.canPerformAction = function(action) {
    const rolesPermissions = {
        cobrador: ["viewPayments"],
        finanzas: ["viewFinancials"],
        admin: ["viewPayments", "viewFinancials", "manageUsers"]
    };
    return rolesPermissions[this.role].includes(action);
};

export default mongoose.model('User', UserSchema);