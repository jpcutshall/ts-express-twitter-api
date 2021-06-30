import mongoose from 'mongoose'

const { Schema } = mongoose

export interface User {
    userName: string,
    password: string,
    bio?: string,
    posts?: [mongoose.ObjectId]
}

const userSchema = new Schema<User>({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bio: String,
    posts: [Schema.Types.ObjectId],

},
{ timestamps: { createdAt: 'created_at' } })

const UserModel = mongoose.model<User>('User', userSchema)

export default UserModel