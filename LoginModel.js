const mongoose = require("mongoose")

const loginUser = mongoose.Schema({
    name: String,
    password:String
});

const loginModel = mongoose.model("loginUser", loginUser)

module.exports = loginModel;