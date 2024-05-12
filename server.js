import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

const connect = async () => {
  try {
    // console.log("hello");
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
};

app.use(express.json());
app.use("/api/user", userRoutes);
app.listen(8800, () => {
  connect();
  console.log(`Server is running on port 8800`);
});
