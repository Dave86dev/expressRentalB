const OrderModel = require('../models/Order');
const MovieModel = require('../models/Movie');
const UserModel = require('../models/User');
const TokenModel = require('../models/Token');

const fs = require('fs');
const mongoose = require('mongoose');

//global variables...variables para recoger tanto el dia de alquiler como el de retorno
var rentDay = new Date();
var returnDay = new Date();

const showOrders = (req, res) => {
    const usuario = req.body;
    //comprobamos que se trata del administrador pidiendo esta información.
    UserModel.findOne({
            $and: [{
                email: usuario.email
            }, {
                password: usuario.password
            }]
        })
        .then((users) => {
            if (users) {
                //se muestra el historial de todos los pedidos hechos a través de la api.
                if (users.rank = 1) {
                    OrderModel.find({})
                        .then(orders => {
                            if (orders == "") {
                                res.send({
                                    "message": "No consta de ningún pedido en nuestra base de datos"
                                })

                            } else {
                                res.send(orders)
                            }
                        })
                        .catch(error => console.log(error))
                } else {
                    res.send({
                        "message": "Introduced data doesn't belong to Admin user."
                    });
                }

            } else {

                res.send({
                    "message": "Introduced data doesn't belong to Admin user."
                });
            }
        })
        .catch(error => console.log(error))


}

const showOrdersUser = (req, res) => {
    //función que devuelve los pedidos hechos por un usuario en concreto.

    let email = req.params.showOrdersUserEmail;

    UserModel.findOne({
            email: email
        })

        .then(users => {

            if (users) {
                //E-mail (unico siempre) encontrado, el usuario existe, guardamos su Id en la variable iduser
                let iduser = users._id;

                //comprobamos si ya ha alquilado algo
                OrderModel.findOne({
                        userid: iduser
                    })
                    .then(orderfound => {
                        if (orderfound) {
                            //podemos mostrar la película alquilada por el cliente desde ahora mismo.
                            let idrent = orderfound.idfilm;

                            //idrent = parseInt(idrent);

                            MovieModel.findOne({
                                    id: idrent
                                })

                                .then(movies => {
                                    //buscamos en las películas los datos correspondientes del título a través de su id.
                                    let rentTitle = movies.title;
                                    let rentPrice = orderfound.price;

                                    if (orderfound.price == null) {
                                        //establecemos 3 euros como precio por defecto si no fue anotado.
                                        rentPrice = 3;
                                    }

                                    //creamos un objeto que mostrará los datos de la película alquilada
                                    let orderdisplay = {
                                        title: rentTitle,
                                        client: users.username,
                                        email: users.email,
                                        phone: users.phone,
                                        orderdate: orderfound.orderdate,
                                        returndate: orderfound.returndate,
                                        price: rentPrice,
                                        days: orderfound.days
                                    }

                                    res.send(orderdisplay);

                                })
                                .catch(error => console.log(error))
                        } else {
                            //el cliente no está procesando un alquiler
                            res.send({
                                "message": `El cliente no ha alquilado ninguna película en estos momentos`
                            });
                        }
                    })
                    .catch(error => console.log(error))
            } else {
                //el cliente no existe en la base de datos.
                res.send("No consta ningún cliente con la dirección de email especificada");
            }

        })
        .catch(error => console.log(error))


}

const placeOrder = (req, res) => {
    //buscamos el token como token activo en la database
    TokenModel.findOne({
            _id: req.body.token
        })
        .then((token) => {
            console.log()
            if (token) {

                UserModel.findOne({
                        _id: req.body.userid
                    })

                    .then(users => {

                        if (users) {
                            //ahora comprobamos si el usuario ha realizado algun pedido
                            OrderModel.findOne({
                                    userid: req.body.userid
                                })
                                .then(order => {
                                    if (order) {
                                        return res.send({
                                            "message": "Oops! You already have one order in process."
                                        });
                                    } else {

                                        //we set the rental date as the day of today, and the return date depending on user's choice.
                                        console.log("SIIIIIIIIIIIIII");
                                        const rB = req.body;

                                        setOrderDates(rB.days);


                                        new OrderModel({

                                                userid: rB.userid,
                                                idfilm: rB.idfilm,
                                                orderdate: rentDay,
                                                returndate: returnDay,
                                                price: 3,
                                                days: rB.days

                                            }).save()
                                            .then(users => {
                                                res.send(users);
                                            })
                                            .catch(error => console.log(error))
                                    }
                                })
                                .catch(error => console.log(error))
                        } else {
                            return res.send({
                                "message": "No existe ningún usuario con esa id en nuestra base de datos"
                            });
                        }
                    })
                    .catch(error => console.log(error))



            } else {
                res.send({
                    "message": "Debes de permanecer dado de alta en el login para realizar esta acción."
                });
            }
        })
        .catch(error => console.log(error))
}

function setOrderDates(days) {


    let dd = rentDay.getDate();
    let mm = rentDay.getMonth() + 1; //Sumamos 1 porque Enero siempre cuenta como 0
    let yyyy = rentDay.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    rentDay = (dd + '/' + mm + '/' + yyyy);
    returnDay.setDate(returnDay.getDate() + days); //sumamos el número de dias obtenido por parámetro,
    //esta cantidad hace referencia a la elección del ususario   
    dd = returnDay.getDate();
    mm = returnDay.getMonth() + 1;
    yyyy = returnDay.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    returnDay = (dd + '/' + mm + '/' + yyyy);


    return rentDay, returnDay;

}

module.exports = {
    showOrders,
    showOrdersUser,
    placeOrder
}