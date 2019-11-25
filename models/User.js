const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    billcard:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    rank:{
        type:Number,
        required:true
    }
})


const UserModel=mongoose.model('user',UserSchema);


module.exports=UserModel;