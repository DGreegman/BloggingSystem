
import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
     },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    author_email: {
        type: String,
        ref: 'User'
    }

},
    {
        timestamps: true,
        versionKey: false
    }
)

export const Blog = mongoose.model('Blog', blogSchema)