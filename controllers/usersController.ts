import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/UserSchema'
import UserModel from '../models/UserSchema'


const users = express.Router()



users.get('/', async (req, res) => {
    let [err, usersArray] = await UserModel.find()
        if(err) {
            res.send(err)
        }

    res.send(usersArray)
})


users.post('/register', async (req, res) => {
    let user: User = {...req.body}
    console.log(`User to be Created ${user}`)
    
    //Error HAndle

    //look up if user already exists
    await UserModel.findOne({userName: user.userName}, null, null, (err, foundUser) => {
        if (err) {
            console.log(err)
        }
        
        if (foundUser) {
            // Username already exists
            console.log('A User with that Username already exists')
            res.sendStatus(401)
            
        } else {

            //Hash password
            bcrypt.hash(user.password, 11, (err, hash) => {
                // Store hash in your password DB.
                if (err) {
                    res.sendStatus(404)
                }
                user.password = hash
                

                //create user in data base and respond with jwt
                const createdUser = new UserModel(user)
                createdUser.save((err, doc) => {
                    if (err) {
                        console.error(err)
                        res.send(err)
                    } else {
                        console.log(doc)
                    }
                })

                res.send(`${user.userName} Created`)
            });
   
        }
    })
})


users.delete('/delete', async (req, res) => {
    const user: User = {...req.body}
    await UserModel.findOneAndDelete({ userName: user.userName }, null, (err, deletedUser) => {
        if (err) {
            console.error(err)
        } else {
            res.send(`Deleted this User ${deletedUser}`)
        }
    })

})


users.post('/login', async (req, res) => {
    const user: User = {...req.body}

    //Find Username
    await UserModel.findOne( {userName: user.userName}, undefined, undefined, (err, userFound) => {

        if (err) {
            console.error(err)
        } else if (userFound) {
            let hash = userFound.password
            bcrypt.compare(user.password, hash, (err, result) => {

                if (err) {
                    res.send(err)
                } 
                
                if (result) {
                    res.send(`Logged in ${user}`)

                } else {
                    res.send('Incorrect Login')
                }

            });

        } else {

            res.send('User not found')
        }
    }) 
})

export default users