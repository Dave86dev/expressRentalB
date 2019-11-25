const axios = require('axios');

const MoviesModel=require('./models/Movie');

//dB connection//////////
const mongoose = require("mongoose");
const uri = "mongodb+srv://adminRental:1234@dbhive-cu5o7.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri,{
     useNewUrlParser:true,
     useUnifiedTopology:true,
     useCreateIndex:true
   }).then( () => {
       console.log('CONNECTION TO mDB ESTABLISHED');
   })
.catch(error=>console.log('Error connecting to the dB' + error));
////////////////////////

//getting num of pages..
// axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=210d6a5dd3f16419ce349c9f1b200d6d&language=es-ES&`)
// .then(function (response) {
//   let total_pages = response.data.total_pages;
  
//   console.log('El número total de páginas es ' + total_pages);
// }).catch(function (error) {
//     // handle error
//     console.log(error);
// })

//introduction of material on the dB

//crear un delay de espera para introducir los datos......40 en 40 cada 10 segundos...
let pag_ini = 499;
let pag_max = pag_ini + 39;
//let pag_max = pag_ini + 19;
let paginadas = 0;

for (let page = pag_ini; page <= pag_max; page++){

axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=210d6a5dd3f16419ce349c9f1b200d6d&language=es-ES&page=${page}`)
  .then(function (response) {
    
    let movies = response.data.results; // Contiene un array de objetos	
		
		
		MoviesModel.insertMany(movies).then( (movies) => {
      console.log("Página " + page + " guardada.")
      paginadas++;
      
		}).catch( (error) => {
			console.log( error );
		})

    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
 
 }

 console.log("el número total de páginas guardadas es de " + paginadas);
 console.log("hemos introducido desde la página " + pag_ini + " hasta la número " + pag_max);


//timeout para calcular el tiempo...
let tiempo = setTimeout(()=>console.log("Now..enter data"), 16000);


