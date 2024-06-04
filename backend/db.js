const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://root:root@kacper.pkzatkb.mongodb.net/?retryWrites=true&w=majority&appName=Kacper")
    .then((result) => {
        console.log("Połączono z bazą")
    }).catch((err) => {
        console.log("Nie można połączyć się z MongoDB. Błąd: " + err)
    });

module.exports = mongoose;