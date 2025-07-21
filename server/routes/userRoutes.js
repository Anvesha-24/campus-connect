const express=require("express");
const router=express.Router();
const User=require("../models/User");
const bcrypt=require("bcryptjs"); // Added for password hashing
const jwt=require("jsonwebtoken");
const authMiddleware=require("../middleware/auth"); //import auth middleware

//register
router.post("/register",async(req,res)=>{
    const {name,email,password,role}=req.body;

     // Hash the password before storing
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt)

    const newUser=new User({
        name,
        email,
        password:hashedPassword,
        role,
    });

    try{
        //check if user already exits or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        //save them
        
        await newUser.save();

        res.status(201).json({
            message:"User registered successfully",
            user:newUser
        });

    }

    catch(error)
    {
        res.status(500).json({
            message:"server error",
            error:error.message});
    }
});

//login
router.post("/login",async(req,res)=>{
    const{email,password}=req.body;

    try{
        //find user by email
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({message:"Invalid credentials"});
        }
        //compare the entered password with the hashed one
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid credentials"});
        }


        //create JWT token
        const token=jwt.sign(
            {
                id:user._id,  // user ID will be available inside token
                role:user.role // you can use this for role-based access
            },
            process.env.JWT_SECRET, // secret key stored in .env
            {expiresIn:"2h"}    // token will expire in 2 hours
        );
        //send token and user details back to frontend
        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:"Server error",
            error:error.message,
        });
    }
});

//protected profile route
router.get("/profile",authMiddleware,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password"); //dont send password
        if(!user)
            return res.status(404).json({message:"User not found"});

        res.status(200).json({user});
    }
    catch(error)
    {
        res.status(500).json({message:"Server error",error:error.message});
    }
});
module.exports=router;