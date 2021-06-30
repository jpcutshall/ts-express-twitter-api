import express from 'express'
import mongoose from 'mongoose'

import users from './controllers/usersController'


const app = express()

app.use(express.json());
require('dotenv').config()
const PORT = process.env.PORT
const URI: string = process.env.MONGODBURI as string



mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true})
    .then( (connection) => {
        console.log(`Connected to MongoDB ${URI}`)
})
    .catch( (err) => {
        console.log(err)
})


// ROUTES
app.use('/user', users)



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})