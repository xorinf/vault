import { Schema, model, Types } from "mongoose";

//create vote schema
const voteSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "User ID is required!"]
    },
    resource: {
        type: Types.ObjectId,
        ref: "resource",
        required: [true, "Resource ID is required!"]
    },
    type: {
        type: String,
        enum: ["UPVOTE", "DOWNVOTE"],
        required: [true, "Vote type is required!"]
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

//compound unique index to prevent duplicate votes
voteSchema.index({ user: 1, resource: 1 }, { unique: true });

//create vote model
export const voteModel = model("vote", voteSchema);
