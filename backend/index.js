
const express = require('express')
const cors = require('cors')

const app = express()

/* config json response */
app.use(express.json())

/* solve cors */
app.use(cors({credentials:true, origin:"http://localhost:3000"}))

/* public folder for images */
app.use(express.static(__dirname +'public'))

/* routes */
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)
const PetsRoutes = require('./routes/PetsRoutes')
app.use('/pets',PetsRoutes)

app.listen(5000)


