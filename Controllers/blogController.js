
const path = require('path');
const BlogSchema = require('../Models/BlogSchema');
const fs = require('fs');

const DefaultBlogController = async (req, res) => {
    console.log("DEFAULT BLOG CONTROLLER");

    const blogs = await BlogSchema.find({ user: req.user._id });
    res.render('viewBlog', { blogs });
}



const AddBlogFormController = (req, res) => {

    console.log("ADD BLOG FORM CONTROLLER");
    res.render('blog');

}

const AddBlogController = async (req, res) => {
    console.log("ADD BLOG CONTROLLER");

    const title = req.body.title;
    const content = req.body.content;
    const image = req.file ? `uploadsFile/${req.file.filename}` : null;

    const blog = new BlogSchema({
        title,
        content,
        image,
        user: req.user._id
    });

    await blog.save();  
    res.redirect('/blog');
}



const EditBlogController = async (req, res) => {

    console.log("EDIT BLOG CONTROLLER");

    const Blog = await BlogSchema.findOne({_id: req.params.id});
    console.log("EDIT BLOG : ", Blog);
    res.render('editBlog', {Blog});

}

const UpdateBlogController = async (req, res) => {

    console.log("UPDATE BLOG CONTROLLER");
    const blog = await BlogSchema.findById(req.params.id);

    if (blog.image) {
        try {
            await fs.unlink(path.join(__dirname, '..', blog.image));
        } catch (err) {
            console.error("ERROR : ", err);
        }
    }

    blog.title = req.body.title;
    blog.content = req.body.content;

    if (req.file) {
        blog.image = `uploadsFile/${req.file.filename}`;
    }

    await blog.save();
    console.log("UPDATED BLOG: ", blog);
    
    res.redirect('/blog');
}



const DeleteBlogController = async (req, res) => {

    console.log("DELETE BLOG CONTROLLER");

    const blog = await BlogSchema.findById(req.params.id);

    if (blog.image) {
        try {
            await fs.unlink(path.join(__dirname, '..', blog.image));
        } catch (err) {
            console.error("ERROR : ", err);
        }
    }

    await BlogSchema.findByIdAndDelete(req.params.id);
    console.log("DELETED BLOG : ", blog);

    res.redirect('/blog');

}

const AllBlogsController = async (req, res) => {
    console.log("ALL BLOGS CONTROLLER");

    const blogs = await BlogSchema.find()
        .populate('user', 'name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name'
            }
        });

    res.render('allBlogs', { blogs });
}

module.exports = { DefaultBlogController, AddBlogFormController, AddBlogController, EditBlogController, UpdateBlogController, DeleteBlogController, AllBlogsController };








