const mongoose = require('mongoose')
const login=mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
})
let loginModel=module.exports=mongoose.model('usersData',login)