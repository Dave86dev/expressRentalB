const mongoose=require('mongoose');

const OrderSchema=mongoose.Schema({
    
    userid:{
        type:String,
        required:true
    },
    idfilm:{
        type:Number,
        required:true
    },
    orderdate:{
        type:String,
        required:true
    },
    returndate:{
        type:String,
        required:true
    },
    price:{
        type:Number,
    },
    days:{
        type:Number,
    }
})


const OrderModel=mongoose.model('order',OrderSchema);


module.exports=OrderModel;
