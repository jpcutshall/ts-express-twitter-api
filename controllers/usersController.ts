import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/UserSchema'
import UserModel from '../models/UserSchema'
import { secret } from '../server'
import auth from '../auth/auth'

const users = express.Router()



/* ROUTES *****************************************/ 
/* GET ALL USERS IN DB */
users.get('/', async (req, res, next) => {
    await UserModel.find( (err, foundUsers) => {
        if (err) {
            return next(err)
        }
        res.send(foundUsers)
    })
})



/* REGISTER USER */
users.post('/register', async (req, res, next) => {
    let userToReg: User = {...req.body}
    console.log(`User to be Registered ${userToReg}`)
    
    //Error HAndle

    //look up if user already exists
    await UserModel.findOne({username: userToReg.username}, null, null, (err, foundUser) => {

        if (err) {  
            return next(err)
        }
        
        if (foundUser) {
            // Username already exists
            return next(new Error("User with that username already exists"))      
        } 

        //Hash password
        bcrypt.hash(userToReg.password, 11, (err, hash) => {
            // Store hash in your password DB.
            if (err) {
                return next(err)
            }

            userToReg.password = hash
            
            //create user in data base and respond with jwt
            const createdUser = new UserModel(userToReg)
            createdUser.save((err, doc) => {
                if (err) {
                    return next(err)
                }
                
                console.log(doc)
                
            })

            // CREATE TOKEN AND SEND BACK TO FRONT END
            let tokenInfo = {
                username: createdUser.username,
                id: createdUser._id,
                role: createdUser.role
            }
            let token = jwt.sign(tokenInfo, secret, { expiresIn: '1h' })
            res.send({
                token: token,
                user: {
                    username: createdUser.username,
                    id: createdUser._id,
                    role: createdUser.role
                }            
            })
        });   
    })
})



/* DELETE USER WITH JSON BODY RN */
users.delete('/delete', auth, async (req, res, next) => {
    const user: User = {...req.body}
    console.log(res.locals)
    await UserModel.findOneAndDelete({ username: user.username }, null, (err, deletedUser) => {

        if (err) {
            console.log(`${err} deleting user`) 
            return next(err)
        }

        if (deletedUser) {
            return res.send(`Deleted this User ${deletedUser}`)
        }

        next(new Error('User not found?'))
        
    })

})



/* LOGIN USER */
users.post('/login', async (req, res, next) => {
    const user: User = {...req.body}

    //Find Username
    await UserModel.findOne( 
    {username: user.username}, 
    undefined, undefined,  // this is to make ts happy
    (err, userFound) => {

        if (err) {
           return next(err)
        }
        
        // If A Username is found Compare passwords
        if (userFound) {

            let hash = userFound.password
            bcrypt.compare(user.password, hash, (err, result) => {

                if (err) {

                    return next(err)
                } 
                
                if (result) {

                    let tokenInfo = {
                        username: userFound.username,
                        id: userFound._id,
                        role: userFound.role
                    }
                    let token = jwt.sign(tokenInfo, secret, { expiresIn: '1h' });
                    return res.send({
                        token: token,
                        user: {
                            username: userFound.username,
                            id: userFound._id,
                            role: userFound.role
                        }
                    })
                } 
                
                res.send('Incorrect Login')

            });

        } else {

            res.send('User not found')
        }
    }) 
})

export default users