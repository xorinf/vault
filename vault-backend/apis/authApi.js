import exp from 'express';
import { userModel } from '../models/userModel.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from '../config/multer.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';
import cloudinary from '../config/cloudinary.js';

export const authAPP = exp.Router();

/**
 * Route: POST /register
 * Description: Register a new user (student only, admin cannot self-register).
 * Accepts multipart/form-data with optional avatar image.
 */
authAPP.post("/register", upload.single("avatar"), async (request, response, next) => {
    let cloudinaryResult;
    try {
        //get user data
        const newUser = request.body;

        //explicitly prevent ADMIN registration
        if (newUser?.role === "ADMIN") {
            return response.status(403).json({ message: "Registration as ADMIN forbidden." });
        }

        let isAllowedRole = ['STUDENT'].includes(newUser?.role);

        if (isAllowedRole) {
            //upload image to cloudinary from memoryStorage if file exists
            if (request.file) {
                cloudinaryResult = await uploadToCloudinary(request.file.buffer);
                //add CDN link of image to newUserObj
                newUser.avatar = cloudinaryResult?.secure_url;
            }

            //hash password and replace plain with hashed one
            newUser.password = await hash(newUser.password, Number(process.env.SALT));

            //create new user document
            const newUserDoc = new userModel(newUser);

            //save document
            await newUserDoc.save();
            response.status(201).json({ message: "User created!" });
        } else {
            response.status(400).json({ message: "Invalid role!" });
        }
    } catch (err) {
        //delete image from cloudinary on error if it was uploaded
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
    }
});

/**
 * Route: POST /login
 * Description: Authenticate user and set JWT cookie.
 */
authAPP.post("/login", async (request, response) => {
    //get user credentials
    const { email, password } = request.body;

    //find user by email
    let user = await userModel.findOne({ email: email });

    //if not found by plain email, check if it is an admin with a hashed email
    if (!user) {
        const admins = await userModel.find({ role: "ADMIN" });
        for (let admin of admins) {
            const isEmailMatched = await compare(email, admin.email);
            if (isEmailMatched) {
                user = admin;
                break;
            }
        }
    }

    if (!user) {
        return response.status(404).json({ message: "Invalid Email!" });
    }

    //compare password
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
        return response.status(400).json({ message: "Invalid Password!" });
    }

    //check if user is active
    if (!user.isUserActive) {
        return response.status(401).json({ message: "User is blocked! Contact Admin!" });
    }

    //create jwt with full user info for check-auth restore
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            college: user.college,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    //remove password from user response
    let userObj = user.toObject();
    delete userObj.password;

    //set token to res header as httpOnly cookie
    response.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    //also return token in body for cross-domain localStorage auth
    response.status(200).json({ message: "Login Successful", payload: userObj, token });
});

/**
 * Route: PUT /profile
 * Description: Update user profile avatar (authenticated).
 */
authAPP.put("/profile", verifyToken("STUDENT", "ADMIN"), upload.single("avatar"), async (request, response, next) => {
    let cloudinaryResult;
    try {
        if (!request.file) {
            return response.status(400).json({ message: "No file uploaded!" });
        }

        cloudinaryResult = await uploadToCloudinary(request.file.buffer);
        const avatarUrl = cloudinaryResult?.secure_url;

        const updatedUser = await userModel.findByIdAndUpdate(
            request.user.id,
            { $set: { avatar: avatarUrl } },
            { new: true, returnDocument: 'after' }
        );

        if (!updatedUser) {
            return response.status(404).json({ message: "User not found!" });
        }

        let userObj = updatedUser.toObject();
        delete userObj.password;

        response.status(200).json({ message: "Profile updated successfully!", payload: userObj });
    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
    }
});

/**
 * Route: PUT /password

 * Description: Change password for any authenticated user.
 */
authAPP.put("/password", verifyToken("STUDENT", "ADMIN"), async (request, response) => {
    //get current password and new password from the body
    const { current_pass, new_pass } = request.body;
    const user = await userModel.findById(request.user.id);
    //check the current password matches
    if (await compare(current_pass, user.password)) {
        //change the password after hashing new password
        let new_password = await hash(new_pass, Number(process.env.SALT));
        user.password = new_password;
        //save
        await user.save({ validateBeforeSave: true });
        //send response
        return response.status(201).json({ message: "Password Changed!" });
    }
    //send response
    return response.status(401).json({ message: "Invalid Current Password!" });
});

/**
 * Route: GET /check-auth
 * Description: Verify JWT cookie and restore user session on page refresh.
 */
authAPP.get("/check-auth", verifyToken("STUDENT", "ADMIN"), (request, response) => {
    response.status(200).json({
        message: "authenticated",
        payload: request.user,
    });
});

/**
 * Route: GET /logout
 * Description: Log out user by clearing JWT cookie.
 */
authAPP.get("/logout", (request, response) => {
    //delete token from cookie storage
    response.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    response.status(200).json({ message: "Logout Successful" });
});
