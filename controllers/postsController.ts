import express from 'express'
import { Post } from '../models/PostSchema'
import PostModel from '../models/PostSchema'

const posts = express.Router()

posts.get('/', async (req, res) => {
    let postsArray = await PostModel.find()
    if (err) {
        res.send(err)
    }
    
    
})