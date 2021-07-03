import express from 'express'
import { Post } from '../models/PostSchema'
import PostModel from '../models/PostSchema'

const posts = express.Router()

posts.get('/', async (req, res, next) => {
    await PostModel.find( (err, foundPosts) => {
        
        if (err) {
            next(err)
            return
        }

        res.send(foundPosts)

    })
     
})


posts.post('/', async (req, res, next) => {
    
})

export default posts