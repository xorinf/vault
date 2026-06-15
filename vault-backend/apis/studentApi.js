import exp from 'express';
import { resourceModel } from '../models/resourceModel.js';
import { voteModel } from '../models/voteModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const studentAPP = exp.Router();

//add verification middleware to all routes
studentAPP.use(verifyToken("STUDENT"));

/**
 * Route: GET /resources
 * Description: View all active resources.
 */
studentAPP.get("/resources", async (request, response) => {
    try {
        const resources = await resourceModel.find({ isResourceActive: true })
            .populate("author", "username avatar email")
            .sort({ createdAt: -1 });

        response.status(200).json({ message: "Resources fetched!", payload: resources });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /resource/:id
 * Description: View a specific active resource with its comments.
 */
studentAPP.get("/resource/:id", async (request, response) => {
    try {
        const resource = await resourceModel.findOne({ _id: request.params.id, isResourceActive: true })
            .populate("author", "username avatar email")
            .populate("comments.user", "username avatar");

        if (!resource) return response.status(404).json({ message: "Resource not found or not active" });

        //increment view count
        resource.viewCount += 1;
        await resource.save({ validateBeforeSave: false });

        response.status(200).json({ message: "Resource fetched!", payload: resource });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: PUT /comment
 * Description: Write a comment on a specific active resource.
 */
studentAPP.put("/comment", async (request, response) => {
    try {
        const { comment, resource_id } = request.body;
        const newComment = {
            user: request.user.id,
            comment: comment
        };
        if (comment === null || comment === undefined || comment === "" || comment === " ") {
            return response.status(401).json({ message: "Invalid Comment!" });
        }

        //push to comments array in model
        const updatedResource = await resourceModel.findOneAndUpdate(
            { _id: resource_id, isResourceActive: true },
            { $push: { comments: newComment } },
            { returnDocument: 'after' }
        );

        if (!updatedResource) {
            return response.status(404).json({ message: "Resource not found or not active" });
        }

        response.status(201).json({ message: "Comment added!", payload: updatedResource });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: POST /vote
 * Description: Cast or switch a vote on a resource.
 */
studentAPP.post("/vote", async (request, response) => {
    try {
        const { resource_id, type } = request.body;

        if (!["UPVOTE", "DOWNVOTE"].includes(type)) {
            return response.status(400).json({ message: "Invalid vote type!" });
        }

        const resource = await resourceModel.findById(resource_id);
        if (!resource) return response.status(404).json({ message: "Resource not found" });

        //check if user already voted
        const existingVote = await voteModel.findOne({ user: request.user.id, resource: resource_id });

        if (existingVote) {
            if (existingVote.type === type) {
                return response.status(200).json({ message: "You already voted this way" });
            }
            //switching vote direction: reverse old vote and apply new one
            const adjustment = type === "UPVOTE" ? 2 : -2;
            existingVote.type = type;
            await existingVote.save();
            await resourceModel.findByIdAndUpdate(resource_id, { $inc: { voteCount: adjustment } });
            return response.status(200).json({ message: "Vote updated!" });
        }

        //new vote
        await voteModel.create({ user: request.user.id, resource: resource_id, type });
        const adjustment = type === "UPVOTE" ? 1 : -1;
        await resourceModel.findByIdAndUpdate(resource_id, { $inc: { voteCount: adjustment } });

        response.status(201).json({ message: "Vote cast!" });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: DELETE /vote/:resourceId
 * Description: Remove a vote from a resource.
 */
studentAPP.delete("/vote/:resourceId", async (request, response) => {
    try {
        const vote = await voteModel.findOneAndDelete({ user: request.user.id, resource: request.params.resourceId });

        if (!vote) return response.status(404).json({ message: "You have not voted on this resource" });

        const adjustment = vote.type === "UPVOTE" ? -1 : 1;
        await resourceModel.findByIdAndUpdate(request.params.resourceId, { $inc: { voteCount: adjustment } });

        response.status(200).json({ message: "Vote removed!" });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /search
 * Description: Search resources by title or description text.
 */
studentAPP.get("/search", async (request, response) => {
    try {
        const { q } = request.query;
        if (!q) return response.status(400).json({ message: "Search query is required" });

        const resources = await resourceModel.find({
            isResourceActive: true,
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { subject: { $regex: q, $options: "i" } },
                { tags: { $regex: q, $options: "i" } }
            ]
        })
            .populate("author", "username avatar email")
            .sort({ createdAt: -1 });

        response.status(200).json({ message: "Search results!", payload: resources });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});
