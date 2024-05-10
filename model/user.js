import mongoose, { Schema } from "mongoose";
const { schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  position: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("User", userSchema);
