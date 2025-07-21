const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config();


const connectDB = require("./config/db"); 

const app=express();
const PORT=process.env.PORT || 5000;
const userRoutes=require("./routes/userRoutes");

// Connect to MongoDB
connectDB();
//middleware
app.use(cors());
app.use(express.json());
app.use("/api/users",userRoutes);

//simple test route
app.get("/",(req,res) =>{
    res.send("api is running...")
});

//start server
app.listen(PORT,()=>{
console.log(`server running on port ${PORT}`);
});