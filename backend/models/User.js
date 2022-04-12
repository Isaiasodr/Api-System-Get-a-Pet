const mongoose = require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name: {
            type: String,
            required:true
        },
        email: {
            type: String,
            required:true
        },
        password: {
            type: String,
            required:true
        },
        image:{
            type:String
        },
        phone:{
            type:String,
            required:true
        },
    },
    /* define quando o dado foi criado ou atualizado */
        {timestamps:true},

            
        
    ),
)

module.exports = User