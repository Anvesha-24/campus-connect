const express=require("express")
const Question=require("../models/Question");
const authMiddleware=require("../middleware/auth");  //jwt auth
const { generateEmbedding } = require("../utils/embeddings");

const router=express.Router();

//GET all questions
router.get("/",async(req,res)=>{
    try{
const questions=await Question.find().sort({createdAt:-1});
res.json(questions);
    }
    catch(err){
res.status(500).json({message:"Failed to fetch questions"});
    }
});

//POST a new question(requires login)

router.post("/",authMiddleware,async(req,res)=>{
    try{
        const embedding = await generateEmbedding(req.body.question);

        const newQuestion=new Question({
            question:req.body.question,
            userId:req.user.id,
            userName:req.user.name,
            ...(embedding && { embedding }),

        });
        await newQuestion.save();
        res.json(newQuestion);
    }
    catch(err){
        res.status(500).json({message:"Failed to post question"});
    }
});
module.exports=router;