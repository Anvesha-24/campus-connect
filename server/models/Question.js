const mongoose=require("mongoose");

const questionSchema=new mongoose.Schema(
    {
        question:{type:String,required:true},
        reply:{type:String},
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        userName:{type:String,default:"Anonymous"},
    },
    {timestamps:true}
);

module.exports=mongoose.model("Question",questionSchema);