const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    userName:{type:String,default:"Anonymous"},
},
{timestamps:true}
);

module.exports= mongoose.model("Review",reviewSchema);