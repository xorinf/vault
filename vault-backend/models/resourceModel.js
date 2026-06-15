import { Schema, model, Types } from "mongoose";

//create comment schema (embedded in resource)
const commentSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "User ID is required!"]
    },
    comment: {
        type: String,
        required: [true, "The comment field cannot be empty!"]
    }
});

//create resource schema
const resourceSchema = new Schema({
    author: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "Author ID is required!"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    content: {
        type: String
    },
    fileUrl: {
        type: String
    },
    fileType: {
        type: String,
        required: [true, "File type is required!"],
        enum: ["PDF", "IMAGE", "NOTE"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required!"]
    },
    semester: {
        type: Number
    },
    tags: [{
        type: String
    }],
    comments: [{ type: commentSchema, default: [] }],
    voteCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    isResourceActive: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true,
    strict: "throw"
});

//create resource model
export const resourceModel = model("resource", resourceSchema);
