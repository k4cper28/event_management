const mongoose = require("mongoose")
module.exports = () => {
    
const connectionParams = {
}

try {
    mongoose.connect(process.env.Mongo_URI, connectionParams)
    console.log("Connected to database successfully")
} catch (error) {
    console.log(error);
    console.log("Could not connect database!")
}

}