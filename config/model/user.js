import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const userData = mongoose.model('User', userSchema);
export default userData;
