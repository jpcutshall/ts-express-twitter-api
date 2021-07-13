import mongoose from "mongoose"

const { Schema } = mongoose

export interface Post {
    author: mongoose.ObjectId,
    body: string,
    likes?: [mongoose.ObjectId],
    image?: {data: Buffer, contentType: string},
    replies?: [mongoose.ObjectId]
}

const postSchema = new Schema<Post>({
    author: {type: Schema.Types.ObjectId, required: true},
    body: {type: String, required: true},
    likes: [Schema.Types.ObjectId],
    image: {
        data: Buffer,
        contentType: String
    },
    replies: [Schema.Types.ObjectId]
},
{ timestamps: { createdAt: 'created_at' } })

const PostModel = mongoose.model<Post>('Post', postSchema)

export default PostModel