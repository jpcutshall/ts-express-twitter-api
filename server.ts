import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import users from './controllers/usersController'
import posts from './controllers/postsController'

const app = express()

app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
)
require('dotenv').config()
const PORT = process.env.PORT
export const secret = process.env.JWT_SECRET as string
const URI: string = process.env.MONGODBURI as string


/* MONGO CONNECTION */
mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
    .then( (connection) => {
        console.log(`Connected to MongoDB ${connection}`)
    })
    .catch( (err) => {
        console.log(err)
    })


// ROUTES
app.use('/user', users)
app.use('/posts', posts)



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})