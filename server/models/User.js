import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    unique: true,
    required: true
  }
});

export default mongoose.model('User', UserSchema);
