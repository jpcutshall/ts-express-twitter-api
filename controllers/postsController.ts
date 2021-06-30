import express from 'express'
import { Post } from '../models/PostSchema'
import PostModel from '../models/PostSchema'

const posts = express.Router()

posts.get('/', async (req, res, next) => {
    let postsArray = await PostModel.find()
    if (err) {
        next(err)
    }


    
})