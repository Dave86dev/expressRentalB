//Basic Import Section
const express=require('express');
const app=express();

//Modular Imports
const {LoginUser} = require('./dB/dbuser');
const {LogoutUser} = require('./dB/dbuser');
const {addUserCheck} = require('./dB/dbuser');
const {recoverUser} = require('./dB/dbuser');
const {eraseUser} = require('./dB/dbuser');
const {showUsers} = require('./dB/dbuser');
const {showUserC} = require('./dB/dbuser');
const {modifyUser} = require('./dB/dbuser');

const {showFilms} = require('./dB/dbmovie');
const {showFilmsId} = require('./dB/dbmovie');
const {showFilmsPopular} = require('./dB/dbmovie');
const {showFilmsTitle} = require('./dB/dbmovie');
const {showFilmsGenre} = require('./dB/dbmovie');
const {addFilms} = require('./dB/dbmovie');

const {showOrders} = require('./dB/dborder');
const {showOrdersUser} = require('./dB/dborder');
const {placeOrder} = require('./dB/dborder');


//Middleware
app.use(express.json());
// Configure headers & cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//db connection
const dbconnect = require('./dbconnect');
dbconnect();


/*ACTIONS*/

//user
app.post('/user/login', LoginUser);
app.get('/user/logout/:token', LogoutUser);
app.get('/user/recover', recoverUser);
app.post('/user/register', addUserCheck);
app.post('/user/modify', modifyUser);
app.delete('/user/delete', eraseUser);
app.get('/user/show', showUsers);
app.post('/user/showme', showUserC);



//films
app.get('/films/show', showFilms);
app.get('/films/id/:showId', showFilmsId);
app.get('/films/popular/:showNum', showFilmsPopular);
app.get('/films/title/:showTitle', showFilmsTitle);
app.get('/films/genre/:showGenre', showFilmsGenre);
//app.post('/films/add', addFilms);


//orders
app.post('/order/show', showOrders);
app.get('/order/show/:showOrdersUserEmail', showOrdersUser);
app.post('/order', placeOrder);

//port listen
app.listen(3000, ()=> console.log('>>>SERVER ONLINE'));