import express from 'express'
import auth from '../auth/auth'
import { Post } from '../models/PostSchema'
import PostModel from '../models/PostSchema'
import fs from "fs"
import multer from 'multer'

const posts = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now())
    }
})

const upload = multer({ storage: storage })



posts.get('/', async (req, res, next) => {
    await PostModel.find( (err, foundPosts) => {
        
        if (err) {
            next(err)
            return
        }

        res.send(foundPosts)

    })
     
})


posts.post('/', auth, upload.single('image'), async (req, res, next) => {
    console.log(req?.file)

    if (req.file) {
        const newPost: Post = {
            author: res.locals.id,
            body: req.body.body,
            image: {
                data: fs.readFileSync('./uploads/' + req.file?.filename) ?? '',
                contentType: 'image/jpeg'
            }   
        }

        const createdPost = new PostModel(newPost)

        createdPost.save( (err, doc) => {

            if (err) {
                return next(err)
            }

            console.log(doc)
            //Change response for front end
            res.send(doc)
        })
        
    } else {
        const newPost: Post = {
            author: res.locals.id,
            body: req.body.body
        }

        const createdPost = new PostModel(newPost)

        createdPost.save( (err, doc) => {

            if (err) {
                return next(err)
            }

            console.log(doc)
            //Change response for front end
            res.send(doc)
        })
    }
})

export default posts