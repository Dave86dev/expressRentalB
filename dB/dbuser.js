const UserModel=require('../models/User');
const TokenModel=require('../models/Token');
const fs = require('fs');
const mongoose = require('mongoose');


const LoginUser = (req, res) => {
    const usuario = req.body;
    
    UserModel.findOne({ $and: [{email: usuario.email},{password: usuario.password}]})
        .then((users)=>{
            if(users){
                
                if(users.email === usuario.email && users.password === usuario.password){
                    //creation of token.
                    
                    new TokenModel ({

                    id_user: users._id,
                    
                    }).save()
                    .then(tokens=>{
                        res.send({
                            token: tokens._id,
                            name: users.username,
                            userid: users._id
                        });
                    })
                    .catch(error=>console.log(error))
                }
            }else{
                
                res.send({"message": "Los datos introducidos no son correctos."});
            }
        })
    .catch(error=>console.log(error))
    
}

const LogoutUser = (req, res) => {
    let token = req.params.token;
    
    TokenModel.findByIdAndDelete(token)
    .then(tokens=>{
        if(tokens){
            console.log("log out exitoso");
            res.send({"message":"Log out completado con éxito"});
        }else{
            console.log("log out fallido");
            res.send({"message":"No se ha podido completar el log out"});
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
                if(users.email === usuario.email && users.username === usuario.username){
                    
                    //we return the user password which will serve to login.
                    res.send("¡NO LO PIERDAS!: Tu password es : " + users.password)
                    
                }
            }else{
                res.send("Los datos introducidos no son correctos");
            }
        })
        .catch(error=>console.log(error))
        }else{
            res.send("Debes de permanecer dado de alta en el login para realizar esta acción.")
        }
    })
    .catch(error=>console.log(error))    
}

const addUserCheck = (req,res) => {
        
        const rB = req.body;
       

            //comprobaciones

            const longCheckMail = /.{8,}/
            //email 8 digit minimum
            if (!longCheckMail.test(rB.email)) {
                return res.send({"message": "Email demasiado corto, el mínimo son 8 caracteres."});
            }

            const longCheckPass = /.{5,}/
            //password 5 digit minimum
            if (!longCheckPass.test(rB.password)) {
                return res.send({"message": "Password demasiado corto, el mínimo son 5 caracteres."});
            }

            //e-mail repetition avoid. 
            UserModel.findOne({email : rB.email})
            .then(userExists=>{

                if (userExists) {       
                    return res.send({"message": `${rB.email} ya existe en nuestra base de datos.`});                                       

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
                    res.send("La eliminación se ha producido correctamente");
                }
            }else{
                res.send("No se ha podido eliminar, los datos introducidos no son correctos.");
            }
        })
        .catch(error=>console.log(error))

    }else{
        res.send("No tienes permisos de administrador para realizar tal acción.")
    }

    }else{
        res.send("Debes de permanecer dado de alta en el login para realizar esta acción.")
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
        res.send("Debes de permanecer dado de alta en el login para realizar esta acción.")
    }
    })
    .catch(error=>console.log(error))
}

const showUserC = (req, res) => {
    
    TokenModel.findOne({_id: req.body.token})
    .then((token)=>{
    
    if(token){ 
        
        const userConcreto = req.body;
        
        //UserModel.find({ $and: [{email: userConcreto.email},{username: userConcreto.username}]})
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
    
    UserModel.findByIdAndUpdate(req.body.id,
        {phone: req.body.phone, billcard: req.body.billcard}, {new:true, useFindAndModify:false})
    .then( (user) => {

        if(user){

            if(user){
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