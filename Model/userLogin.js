const mongoose = require('mongoose')
const login=mongoose.Schema({
    name:{
        type: String,
        require:true
    },
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
