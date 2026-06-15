import exp from 'express';
import { resourceModel } from '../models/resourceModel.js';
import { userModel } from '../models/userModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from '../config/multer.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';
import cloudinary from '../config/cloudinary.js';

export const adminAPP = exp.Router();

/**
 * Route: POST /resource
 * Description: Upload a new resource (any authenticated user can upload).
 */
adminAPP.post("/resource", verifyToken("STUDENT", "ADMIN"), upload.single("file"), async (request, response) => {
    let cloudinaryResult;
    try {
        if (request.body.author !== request.user.id) {
            return response.status(401).json({ message: "Unauthorized! You can only create resources for yourself." });
        }

        //check author exists
        let author = await userModel.findById(request.body.author);
        if (!author) {
            return response.status(404).json({ message: "Invalid Author" });
        }

        //create resource document
        const newResource = { ...request.body, author: request.user.id };

        if (request.file) {
            cloudinaryResult = await uploadToCloudinary(request.file.buffer);
            newResource.fileUrl = cloudinaryResult?.secure_url;
        }

        //parse tags if sent as JSON string
        if (typeof newResource.tags === "string") {
            try { newResource.tags = JSON.parse(newResource.tags); } catch (e) { newResource.tags = []; }
        }

        const resource = new resourceModel(newResource);

        //save
        await resource.save();
        response.status(201).json({ message: "Resource created!", payload: resource });
    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /resources
 * Description: Get own uploaded resources.
 */
adminAPP.get("/resources", verifyToken("STUDENT", "ADMIN"), async (request, response) => {
    //get user id from decoded token
    const userId = request.user?.id;

    //get resources by user id
    const resources = await resourceModel.find({ author: userId });
    response.status(200).json({ message: "Resources fetched!", payload: resources });
});

/**
 * Route: GET /resource/:id
 * Description: Read a single resource.
 */
adminAPP.get("/resource/:id", verifyToken("STUDENT", "ADMIN"), async (request, response) => {
    try {
        const resource = await resourceModel.findById(request.params.id)
            .populate("author", "username avatar email")
            .populate("comments.user", "username avatar");

        if (!resource) return response.status(404).json({ message: "Resource not found" });
        response.status(200).json({ message: "Resource fetched!", payload: resource });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: PUT /resource
 * Description: Edit an existing resource (owner only).
 */
adminAPP.put("/resource", verifyToken("STUDENT", "ADMIN"), upload.single("file"), async (request, response) => {
    let cloudinaryResult;
    try {
        const modifiedResource = request.body;
        const resource = await resourceModel.findById(modifiedResource._id);

        if (!resource) return response.status(404).json({ message: "Resource not found" });

        //verify ownership
        if (resource.author.toString() !== request.user.id) {
            return response.status(401).json({ message: "Unauthorized! You can only edit your own resources." });
        }

        if (request.file) {
            cloudinaryResult = await uploadToCloudinary(request.file.buffer);
            modifiedResource.fileUrl = cloudinaryResult?.secure_url;
        }

        //parse tags if sent as JSON string
        if (typeof modifiedResource.tags === "string") {
            try { modifiedResource.tags = JSON.parse(modifiedResource.tags); } catch (e) { /* keep as is */ }
        }

        //update resource
        const updatedResource = await resourceModel.findByIdAndUpdate(
            modifiedResource._id,
            { $set: modifiedResource },
            { new: true, returnDocument: 'after' }
        );
        response.status(200).json({ message: "Resource updated!", payload: updatedResource });
    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: DELETE /resource/:id
 * Description: Soft delete a resource (set isResourceActive to false).
 */
adminAPP.patch("/resource/delete/:id", verifyToken("STUDENT", "ADMIN"), async (request, response) => {
    try {
        const resource = await resourceModel.findById(request.params.id);
        if (!resource) return response.status(404).json({ message: "Resource not found" });

        //only owner or admin can delete
        if (resource.author.toString() !== request.user.id && request.user.role !== "ADMIN") {
            return response.status(401).json({ message: "Unauthorized! You can only delete your own resources." });
        }

        resource.isResourceActive = false;
        await resource.save({ validateBeforeSave: false });
        response.status(200).json({ message: "Resource deleted!", payload: resource });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: PATCH /resource/restore/:id
 * Description: Restore a soft-deleted resource (owner only).
 */
adminAPP.patch("/resource/restore/:id", verifyToken("STUDENT", "ADMIN"), async (request, response) => {
    try {
        const resource = await resourceModel.findById(request.params.id);
        if (!resource) return response.status(404).json({ message: "Resource not found" });

        if (resource.author.toString() !== request.user.id) {
            return response.status(401).json({ message: "Unauthorized! You can only restore your own resources." });
        }

        const updatedResource = await resourceModel.findByIdAndUpdate(request.params.id, { isResourceActive: true }, { returnDocument: 'after' });
        response.status(200).json({ message: "Resource restored!", payload: updatedResource });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /all-resources (ADMIN only)
 * Description: Admin view of all resources (active and inactive).
 */
adminAPP.get("/all-resources", verifyToken("ADMIN"), async (request, response) => {
    try {
        const resources = await resourceModel.find({})
            .populate("author", "username avatar email")
            .sort({ createdAt: -1 });

        response.status(200).json({ message: "All resources fetched!", payload: resources });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /users (ADMIN only)
 * Description: Admin view of all non-admin users in the system.
 */
adminAPP.get("/users", verifyToken("ADMIN"), async (request, response) => {
    try {
        const users = await userModel.find({ role: { $ne: "ADMIN" } }, { password: 0 });
        response.status(200).json({ message: "Users fetched!", payload: users });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: PATCH /users/status/:id (ADMIN only)
 * Description: Admin toggle to block/activate an existing user.
 */
adminAPP.patch("/users/status/:id", verifyToken("ADMIN"), async (request, response) => {
    try {
        //find user by ID
        const user = await userModel.findById(request.params.id);
        if (!user) return response.status(404).json({ message: "User not found" });

        //toggle boolean
        user.isUserActive = !user.isUserActive;

        //save updated
        await user.save();
        response.status(200).json({ message: "User status updated!", payload: user });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: PATCH /resources/status/:id (ADMIN only)
 * Description: Admin toggle to block/restore a resource.
 */
adminAPP.patch("/resources/status/:id", verifyToken("ADMIN"), async (request, response) => {
    try {
        const resource = await resourceModel.findById(request.params.id);
        if (!resource) return response.status(404).json({ message: "Resource not found" });

        resource.isResourceActive = !resource.isResourceActive;
        await resource.save({ validateBeforeSave: false });

        response.status(200).json({ message: "Resource status updated!", payload: resource });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});
