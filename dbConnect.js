const mongoose = require("mongoose")
// const dotenv = require("dotenv");
const mongouri='mongodb+srv://Rishhiiii27:rishi27@cluster0.uecy5na.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongouri)
.then(function(db){
    console.log('db connect');
})
.catch(function(err){
    console.log(err);
});