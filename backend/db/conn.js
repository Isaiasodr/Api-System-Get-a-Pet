const mongoose = require('mongoose')

async function main(){
    await mongoose.connect('mongodb://localhost:27017/get_a_pet')
    console.log("conectou ao mongoose")
}
main().catch((error)=> console.log(error))

module.exports= mongoose