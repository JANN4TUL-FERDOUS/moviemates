import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },

  user: {
    id: String,
    name: String,
    avatar: String,
  },

  text: String,

  reactions: [
    {
      emoji: String,
      userId: String,
    },
  ],

  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },

  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);