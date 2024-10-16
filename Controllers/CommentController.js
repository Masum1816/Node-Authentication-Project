const Comment = require("../Models/CommentSchema");
const BlogSchema = require('../Models/BlogSchema')

const AddCommentController = async (req, res) => {
    
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/logIn');
    // }

    const userId = req.user._id;
    const blogId = req.params.id;
    const comment = req.body.comment;

    console.log("USERID : ", userId);

    const newComment = new Comment({
        comment: comment,
        user: userId,
        blog: blogId
    });

    await newComment.save();

    await BlogSchema.findByIdAndUpdate(blogId, { $push: { comments: newComment._id } });

    res.redirect('/allBlogs');
};

module.exports = { AddCommentController };
