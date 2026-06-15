import { Schema, model } from "mongoose";

//create user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: [true, "Username already taken!"],
        minlength: [3, "Username must be at least 3 characters!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: [true, "Email already in use!"]
    },
    password: {
        type: String,
        required: [true, "Password Required!"],
        min: [6, "Password should be atleast 6 characters!"]
    },
    role: {
        type: String,
        enum: ["STUDENT", "ADMIN"],
        required: [true, "{VALUE} is an Invalid Role"]
    },
    avatar: {
        type: String
    },
    college: {
        type: String
    },
    isUserActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

//create user model
export const userModel = model("user", userSchema);
