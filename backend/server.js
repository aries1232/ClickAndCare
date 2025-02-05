import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from './config/cloudinary.js';
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";

//app config
const app = express();
const port = process.env.PORT || 3000;
connectDB()
connectCloudinary()

//middlewares
app.use(express.json());
app.use(cors());


app.use('/api/admin',adminRouter)  //localhost:3000/api/admin/add-doctor
app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
  console.log("Server running on", port);
});
