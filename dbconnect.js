const dbconnect = () => {

    //dB connection//////////
    const mongoose = require("mongoose");
    const uri = "mongodb+srv://adminRental:1234@dbhive-cu5o7.mongodb.net/test?retryWrites=true&w=majority";

    mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(() => {
            console.log('CONNECTION TO mDB ESTABLISHED');
        })
        .catch(error => console.log('Error connecting to the dB' + error));
    ////////////////////////

}

module.exports = dbconnect;