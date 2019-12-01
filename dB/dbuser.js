const UserModel=require('../models/User');
const TokenModel=require('../models/Token');
const fs = require('fs');
const mongoose = require('mongoose');


const LoginUser = (req, res) => {
    const usuario = req.body;
    
    UserModel.findOne({ $and: [{email: usuario.email},{password: usuario.password}]})
        .then((users)=>{
            if(users){
                //if BOTH email and password match. 
                if(users.email === usuario.email && users.password === usuario.password){
                    //creation of token.
                    
                    new TokenModel ({

                    id_user: users._id,
                    
                    }).save()
                    .then(tokens=>{
                        res.send({
                            //IMPORTANT, we return the object with token, name and userid
                            token: tokens._id,
                            name: users.username,
                            userid: users._id
                        });
                    })
                    .catch(error=>console.log(error))
                }
            }else{
                
                res.send({"message": "Introduced data is not correct."});
            }
        })
    .catch(error=>console.log(error))
    
}

const LogoutUser = (req, res) => {
    let token = req.params.token;
    
    TokenModel.findByIdAndDelete(token)
    .then(tokens=>{
        if(tokens){
            //user was found and token is DELETED.
            res.send({"message":"Logged out successfully"});
        }else{
            
            res.send({"message":"Can't complete log out process"});
        }
    })
     
    .catch(error=>console.log(error))
}
    
const recoverUser = (req, res) => {
    const usuario = req.body;
    
    TokenModel.findOne({_id: usuario.token})
    .then(tokens=>{
        if(tokens){
            UserModel.findOne({ $and: [{email: usuario.email},{username: usuario.username}]})
        .then((users)=>{
            if(users){
                //BOTH user email and password match in our database.
                if(users.email === usuario.email && users.username === usuario.username){
                    
                    //we return the user password which will serve to login.
                    res.send("¡Don't loose it!: Your password is : " + users.password)
                    
                }
            }else{
                res.send("Introduced data is not correct");
            }
        })
        .catch(error=>console.log(error))
        }else{
            res.send("You must be logged in to complete this action")
        }
    })
    .catch(error=>console.log(error))    
}

const addUserCheck = (req,res) => {
        
        const rB = req.body;
            //we check the given data... in case it's faulty we exit with return

            const longCheckMail = /.{8,}/
            //email 8 digit minimum
            if (!longCheckMail.test(rB.email)) {
                return res.send({"message": "E-mail too short, at least 8 characters."});
            }

            const longCheckPass = /.{5,}/
            //password 5 digit minimum
            if (!longCheckPass.test(rB.password)) {
                return res.send({"message": "Password too short, at least 5 characters"});
            }

            //e-mail repetition avoid. 
            UserModel.findOne({email : rB.email})
            .then(userExists=>{

                if (userExists) {       
                    return res.send({"message": `${rB.email} already existing on our database`});                                       

                }else{
                    addUser(req,res,rB);
                }  
            })
            .catch(error=>console.log(error));        
}

const addUser = (req,res,rB) => {
    
    const rBok = rB;

    new UserModel ({
        
        username: rBok.username,
        email: rBok.email,
        phone: rBok.phone,
        billcard: rBok.billcard,
        password: rBok.password,
        rank: 0
        
    }).save()
    .then(users=>{
        //res.send(users);
        return res.send({
            name: rBok.username
        });
        
    })
    .catch(error=>console.log(error))
}

const eraseUser = (req,res) => {
    
TokenModel.findOne({_id: req.body.token})
.then((token)=>{

if(token){
const usuario = req.body;

let admin_id = token.id_user;
        
    if(admin_id == `5dd403c6a6143003107c3f2e`){
   
    UserModel.findOne({ $and: [{email: usuario.email},{password: usuario.password}]})
        .then((users)=>{
            if(users){

                if(users.email === usuario.email && users.password === usuario.password){
                    
                    users.delete();
                    res.send("Delete procedure complete.");
                }
            }else{
                res.send("Couldn't delete, data is not correct.");
            }
        })
        .catch(error=>console.log(error))

    }else{
        res.send("You need admin privileges to proceed with such action.")
    }

    }else{
        res.send("You should remain logged in to proceed with such action.")
    }
    })
    .catch(error=>console.log(error))
}

const showUsers = (req, res) => {
    TokenModel.findOne({_id: req.body.token})
    .then((token)=>{
    
    if(token){    
    
        //we show all users
        UserModel.find({})
        .then(users=>{
            res.send(users)
        })
        .catch(error=>console.log(error))
    }else{
        res.send("You should remain logged in to proceed with such action.")
    }
    })
    .catch(error=>console.log(error))
}

const showUserC = (req, res) => {
    
    //token search...
    TokenModel.findOne({_id: req.body.token})
    .then((token)=>{
    
    if(token){ 
        
        const userConcreto = req.body;
        
        //token is found and user is searched, if found, value will be returned.
        UserModel.findOne({username: userConcreto.name})
        .then(users=>{
            if(users){
                res.send(users)
            }
        })
        .catch(error=>console.log(error))
    }else{
        
        res.send({"message": "You must be logged in to see this"})
    }
    })
    .catch(error=>console.log(error))
    
}

const modifyUser = (req, res) => {
    //we search the user and once found, we set the PHONE and BILLCARD fields simultaneously
    UserModel.findByIdAndUpdate(req.body.id,
        {phone: req.body.phone, billcard: req.body.billcard}, {new:true, useFindAndModify:false})
    .then( (user) => {

        if(user){

            if(user){
                //then positively user was found and updated.
                res.send(user);
            }else{
                res.send({"message": "Oops! there was an error updating the changes."})
            }
            
        }
    }).catch (err => console.log(err));    
}

module.exports= {
    LoginUser,
    LogoutUser,
    recoverUser,
    addUser,
    modifyUser,
    addUserCheck,
    eraseUser,
    showUsers,
    showUserC
}