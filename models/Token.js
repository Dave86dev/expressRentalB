const mongoose=require('mongoose');

const TokenSchema=mongoose.Schema({
    id_user:{
        type:String,
        required:true
    }
})


const TokenModel=mongoose.model('token',TokenSchema);

module.exports=TokenModel;