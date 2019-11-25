const mongoose=require('mongoose');

const MovieSchema=mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String
    
    },
    original_title: {
        type: String
    },
    release_date: {
        type: String
    },
    poster_path: {
        type: String
    },
    backdrop_path: {
        type: String
    },
    video: {
        type: Boolean
    },
    original_language: {
        type: String
    },
    overview: {
        type: String
     },
    genre_ids: {
        type: Array
    },
    adult: {
        type: Boolean
    },
    popularity: {
        type: Number
     },
    vote_count: {
        type: Number
    },
    vote_average: {
        type: Number
    }
})


const MoviesModel=mongoose.model('Movie',MovieSchema);


module.exports=MoviesModel;