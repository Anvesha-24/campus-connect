const express=require("express");
const router=express.Router();
const User=require("../models/User");
const bcrypt=require("bcryptjs"); // Added for password hashing
const jwt=require("jsonwebtoken");
const authMiddleware=require("../middleware/auth"); //import auth middleware
const multer=require("multer");
const { uploadBufferToCloudinary } = require("../utils/uploadToCloudinary");

// ------------------- AVATAR UPLOAD CONFIG -------------------
// Memory storage - the image buffer goes straight to Cloudinary, never
// touching Render's ephemeral local disk.
const avatarUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max, avatars don't need to be huge
});

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
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
                avatar:newUser.avatar,
            },
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
                id:user._id, 
                name:user.name,
                email:user.email,// user ID will be available inside token
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
                avatar:user.avatar,
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

// ------------------- UPLOAD/UPDATE AVATAR -------------------
router.post("/profile/avatar", authMiddleware, avatarUpload.single("avatar"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const { url: avatarUrl } = await uploadBufferToCloudinary(req.file.buffer, {
            folder: "campus-connect/avatars",
            resourceType: "image",
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarUrl },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Avatar updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports=router;

