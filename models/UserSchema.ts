import mongoose from 'mongoose'

const { Schema } = mongoose

export interface User {
    username: string,
    password: string,
    bio?: string,
    posts?: [mongoose.ObjectId],
    role: string
}

const userSchema = new Schema<User>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bio: String,
    posts: [Schema.Types.ObjectId],
    role: {type: String, default: 'USER'}

},
{ timestamps: { createdAt: 'created_at' } })

const UserModel = mongoose.model<User>('User', userSchema)

export default UserModel