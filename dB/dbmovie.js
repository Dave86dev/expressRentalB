const MovieModel=require('../models/Movie');
//const TokenModel=require('../models/Token');


const showFilms = (req, res) => {
    //funcion que muestra todas las películas existentes en la database alojada en mongoDB
    //en este caso limitada a mostrar 600 referencias.
    MovieModel.find({}).limit(600)
    .then(movies=>{
        res.send(movies)
    })
    .catch(error=>console.log(error))
}

const showFilmsId = (req, res) => {
   //funcion que muestra un título al pasarle por parametro un id especifico en la api rest.
   
   let id = req.params.showId;
   
   MovieModel.findOne({id:id})
    
    .then(movies=>{
        
        res.send(movies)
        
    })
    .catch(error=>console.log(error))

}

const showFilmsPopular = (req, res) => {
    //funcion que muestra el número de películas deseado ordenado por popularidad.
    //introducidos un número como parámetro en la url de la api.
    //en este caso se ordena por popularidad descendente (popularity: -1). 
    let num = req.params.showNum;
    num = parseInt(num);
    
    if(!num)(num = 25);
    
    MovieModel.find({}).limit(num).sort({ popularity : -1 }) 
     .then(movies=>{
         
         res.send(movies)
         
     })
     .catch(error=>console.log(error))
 
}

const showFilmsRated = (req, res) => {
    //función que muestra las películas según votacion de los usuarios. 
    //cabe especificar que el número de votos no es un factor relevante aqui.
    let num = req.params.showNum;
    num = parseInt(num);
    
    if(!num)(num = 25);
    
    MovieModel.find({}).limit(num).sort({ vote_average : -1 }) 
     .then(movies=>{
         
         res.send(movies)
         
     })
     .catch(error=>console.log(error))
 
}

const showFilmsTitle = (req, res) => {
    //función que nos muestra películas por título, limitada a 6 resultados.
    //se usa regex para acotar el string que contiene el título además de 
    //interpretar el resultado de forma case insensitive.
    let titulo = req.params.showTitle;
    
    MovieModel.find({"title" : {$regex : `.*${titulo}.*`, $options: 'i'}}).limit(6)
     
     .then(movies=>{
         
         res.send(movies)
         
     })
     .catch(error=>console.log(error))
 
}

const showFilmsGenre = (req, res) => {

    
    //genre translator, objeto que asigna un valor númerico 
    //a cada string(género) posible para posterior comparativa con la base de datos.
    let allgenres = {
        "action": 28,
        "adventure": 12,
        "animation": 16,
        "comedy": 35,
        "crime": 80,
        "documentary": 99,
        "drama": 18,
        "family": 10751,
        "fantasy": 14,
        "history": 36,
        "horror": 27,
        "music": 10402,
        "mystery": 9648,
        "romance": 10749,
        "science fiction": 878,
        "tv movie": 10770,
        "thriller": 53,
        "war": 10752,
        "western" : 37
    } 
    
    let genref = req.params.showGenre;
    
    //genref = género introducido por url en nuestra api
    //limitamos a 6 los resultados y mostramos los resultados según fecha descendiente
    MovieModel.find({ genre_ids: allgenres[genref]}).limit(6).sort({ release_date : -1 })
     
     .then(movies=>{
         
         res.send(movies)
         
     })
     .catch(error=>console.log(error))
 
}

const addFilms = (req,res) => {
    
    const rB = req.body;
    //función encargada de añadir un nuevo título (película) a la base de datos.
    new MovieModel ({
        id: rB.id,
        title: rB.title,
        original_title: rB.original_title,
        release_date: rB.release_date,
        poster_path: rB.poster_path,
        backdrop_path: rB.backdrop_path,
        video: rB.video,
        original_language: rB.original_language,
        overview: rB.overview,
        genre_ids: rB.genre_ids,
        adult: rB.adult,
        popularity: rB.popularity,
        vote_count: rB.vote_count,
        vote_average: rB.vote_average
    }).save()
    .then(movies=>{
        res.send(movies);
    })
    .catch(error=>console.log(error))
}


module.exports= {
    showFilms,
    showFilmsId,
    showFilmsPopular,
    showFilmsRated,
    showFilmsTitle,
    showFilmsGenre,
    addFilms
}