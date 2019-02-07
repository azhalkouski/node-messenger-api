import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
  userIds: [String],
  lastMessageId: String,
  lastActive: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', ChatSchema);
