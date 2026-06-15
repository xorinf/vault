import exp from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import { studentAPP } from "./APIs/StudentAPI.js";
import { adminAPP } from "./APIs/ResourceAPI.js";
import { authAPP } from "./APIs/AuthAPI.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

config({ path: ".env", quiet: true }); // Vercel injects env vars directly; ".env" used as local fallback

//create express app
const app = exp();

//enable cors
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL];
app.use(cors({
  origin: function (origin, callback) {
     // Allow local dev, exact FRONTEND_URL matched, or ANY Vercel preview URL
     if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('vercel.app'))) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
  },
  credentials: true
}));

//use body parser middleware
app.use(exp.json())

//add cookie parser middleware
app.use(cookieParser());

//path level middlewares
app.use("/student-api", studentAPP);
app.use("/resource-api", adminAPP);
app.use("/auth", authAPP);

//port and db
const port = process.env.PORT || 5000;
const db_address = process.env.DB_ADDRESS;

//start server and connect to DB
try {
  await connect(db_address);
  console.log(`The DataBase is connected!`);
  if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => console.log(`server listening at port : ${port} ...`));
  }
} catch (err) {
  console.log("con refused :", err);
}
//handle invalid path
app.use((request, response, next) => {
  console.log("ERROR : INVALID URL");
  return response.status(404).json({ message: "Invalid URL" });
});
//handle errors
//Error handling middleware
app.use((err, req, res, next) => {
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Error cause:", err.cause);
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;
  // check mongoose error!
  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});

export default app;
