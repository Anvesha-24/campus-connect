const mongoose=require("mongoose");

const questionSchema=new mongoose.Schema(
    {
        question:{type:String,required:true},
        reply:{type:String},
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        userName:{type:String,default:"Anonymous"},
        embedding: {
            type: [Number], // 384-dim sentence embedding from the question text
            default: undefined,
            select: false,
        },
    },
    {timestamps:true}
);

module.exports=mongoose.model("Question",questionSchema);