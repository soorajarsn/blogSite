const express=require('express');
const getPages=require('../controllers/getController');
const postPages=require('../controllers/postController');
const router=express.Router();

const redirectLogin=(req,res,next)=>{
    if(!req.session.userId)
      redirect('/login');
    next();
  }

router.route('/').get(getPages.indexPage);
router.route('/homepage').get(getPages.homePage);
router.route('/login').get(getPages.loginPage);
router.route('/signup').get(getPages.signupPage);

router.route('/login').post(postPages.loginPage);
router.route('/signup').post(postPages.signupPage);

router.route('/blog').get(getPages.blogPage);
router.route('/profile').get(redirectLogin,getPages.profilePage);
router.route('/logout').get(redirectLogin,(req,res)=>{
    req.session.destroy(err=>{
        if(err)
          res.redirect('/homepage');
        res.clearCookie('user');
        res.redirect('/login');
      });
  })

router.route('/blogshow').get(getPages.blogshow);
router.route('/blog').post(redirectLogin,postPages.blogPage);
router.route('/editblog').get(getPages.editBlogPage);
router.route('/editblog').post(postPages.editBlogPage);
router.route('/removeblog').get(getPages.deleteBlogPage);
router.route('/upvote').post(postPages.upvote);
router.route('/downvote').post(postPages.downvote);
router.route('/comment').post(postPages.comment);
module.exports=router;
