import mongoose from 'mongoose';
import names from 'starwars-names';

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    default: names.random,
  },
  photoUrl: {
    type: String,
    default: () => `https://github.com/identicons/${new Date().getMilliseconds()}.png`,
  },
  status: {
    type: String,
    default: 'online',
  },
});

export default mongoose.model('User', UserSchema);
