const express = require('express');
const router = express.Router();
const controllers = require('../Controllers/Controllers');
const passport = require('../configFile/passport');
const blogController = require('../Controllers/blogController');
const upload = require('../configFile/multer');
const TopicController = require('../Controllers/TopicController');
const CommentController = require('../Controllers/CommentController');

router.get('/', controllers.isAuthenticated, controllers.DefaultController);
router.get('/logIn', controllers.LogInController);
router.get('/signUp', controllers.SignUpController);
router.post('/logIn', passport.authenticate('local', {  failureRedirect: '/login' }), controllers.logINCon);
router.post('/signUp', controllers.SignUpController);
router.get('/logOut', controllers.LogOutController);
router.get('/profile', controllers.isAuthenticated, controllers.ProfilePageController);
router.get('/changePassword', controllers.isAuthenticated, controllers.ChangePasswordController);
router.post('/changePasswordForm', controllers.isAuthenticated,  controllers.ChangePasswordFormController);
router.get('/forgetPassword', controllers.ForgetPasswordController);
router.post('/forgetPasswordForm', controllers.ForgetPasswordFormController);
router.get('/otpConfirm/:id', controllers.OTPConfirmController);
router.post('/otpConfirmForm/:id', controllers.OTPCofirmFormController);
router.get('/changeNewPassword/:id', controllers.ChangeNewPasswordController)
router.post('/changeNewPasswordForm/:id', controllers.ChangeNewPasswordFormController);

router.get('/blog', controllers.isAuthenticated, blogController.DefaultBlogController);
router.get('/blogForm', controllers.isAuthenticated, blogController.AddBlogFormController)
router.post('/addBlog', controllers.isAuthenticated, upload.single('image'), blogController.AddBlogController);
router.get('/editBlog/:id', controllers.isAuthenticated, blogController.EditBlogController);
router.post('/updateBlog/:id', controllers.isAuthenticated, upload.single('image'), blogController.UpdateBlogController);
router.get('/deleteBlog/:id', controllers.isAuthenticated, blogController.DeleteBlogController);
router.get('/allBlogs', controllers.isAuthenticated, blogController.AllBlogsController);

router.get('/topic', controllers.isAuthenticated, TopicController.DefaultTopicController);
router.get('/addTopic', controllers.isAuthenticated, TopicController.AddTopicController);
router.post('/addTopicForm', controllers.isAuthenticated, TopicController.AddTopicFormController);
router.get('/addSubTopic', controllers.isAuthenticated, TopicController.AddSubTopicController);
router.post('/addSubTopicForm', controllers.isAuthenticated, TopicController.AddSubTopicFormController);

router.post('/addComment/:id', controllers.isAuthenticated, CommentController.AddCommentController);

module.exports = router;
