import jwt from 'jsonwebtoken'
import { secret } from '../server'


const auth = (req: any, res: any, next: any) => {
	let token = req.headers['x-auth-token']

    if (token) {
        jwt.verify(token, secret, undefined, ( err, decoded) => {
            if (err) { 
                return next(err)
            }

            if (decoded) {
                
                res.locals = decoded
                return next()
            }
            
        })
    }
}

export default auth