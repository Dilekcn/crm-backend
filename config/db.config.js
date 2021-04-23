const mongoose = require("mongoose");
module.exports = () => {
  mongoose.connect("mongodb+srv://blackeagle4894:blackeagle4894@blackeagle4894.uyz3k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})
  mongoose.connection.on("open", () => {
    console.log("DB connection established")
  })
  
  mongoose.connection.on("error", (err) => {
    console.log("Connection failed" + err)
  })
}