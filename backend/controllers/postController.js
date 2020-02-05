const dbConn = require('../databases/mySqlite');
const users = dbConn.users;
const blogs= dbConn.blogs;
const vote= dbConn.vote;
const comments=dbConn.comments;
function signupPage(req, res) {
  const {
    name,
    email,
    password
  } = req.body;
  console.log(req.body);
  if (!(name && email && password)) {
    // console.log('err');
    // return res.render('signup', {
    //   msg: undefined
    // });
    res.redirect('/signup');
  } else {
    users.create({
        name,
        email,
        password
      })
      .then(user => {
        if(user){
      //  console.log("User(inside post singup handling method) : ", user);

        req.session.userId = user.id;

        // console.log('Session(inside post signup) : ', req.session);
        // console.log('SessionID(req.sessionID) : ', req.sessionID);
        // console.log('Set UserId(inside post signup) for the session:', user.id);
        // console.log('req.session.userId : ', req.session.userId);
        // res.render('profile', {
        //   msg: 'User successfully created',
        //   user: user.name,
        //   list: []
        // });
        res.redirect('/homepage');
        }else{
          res.redirect('/signup');
        }
      })
      .catch(err => {
        if (err.parent.errno == 19) {
         // console.log(err);
          res.redirect('/signup');
          // return res.render('signup', {
          //   msg: 'Email already exists!!!'
          // }); //You can pass message that user already exists
          //errno=19 can be because of null entry that is not possible here, and it can also be for
          //duplicate entry in unique column
        } else {
          console.log(err);
          // return res.render('profile', {
          //   user: undefined,
          //   msg: 'Error in creating user',
          //   list: []
          // });
          res.redirect('/signup');
        }
      });
  }
}

function loginPage(req, res) {
  const Useremail = req.body.email,
    Userpassword = req.body.password;
  users.findOne({
    where: {
      email: Useremail,
      password: Userpassword
    }
  }).then(user => {
  //  console.log(user);
    if (user) {
      // Set-Cookie: sessionId=1;

      // console.log("User(inside post singin handling method) : ", user);
      // console.log('Session(inside post signin) : ', req.session);
      // console.log('SessionID(req.sessionID) : ', req.sessionID);
      // console.log('Set UserId(inside post signin) for the session:', user.id);
      // console.log('req.session.userId : ', req.session.userId);


      req.session.userId = user.id;
      // lists.findAll({
      //   where: {
      //     user_id: user.id
      //   }
      // }).then(list => {
      //   // var todos = [];
      //   // for (var i = 0; i < list.length; i++) {
      //   //   todos.push(list[i].dataValues);
      //   // }
      //   // console.log('todos : ', todos);
      //   // return res.render('profile', {
      //   //   msg: 'User successfully logged in',
      //   //   user: user.name,
      //   //   list: todos
      //   // });
      //   res.redirect('/homepage')
      // }).catch(err => {
      //   console.log(err);
      //   return res.render('/signin', {
      //     user: 'Error signing in!!!'
      //   });
      // });
      res.redirect('/homepage');

    } else {
      // return res.render('signin', {
      //   user: user
      // });
      res.redirect('/login');
    }
  }).catch(err => {
   // console.log(err);
    // return res.render('/signin', {
    //   user: 'Error signing in!!!'
    // });
    res.redirect('/login');
  });
}

function blogPage(req,res){
    var { heading, content }=req.body;
    console.log('\n\n\n\n\n\nRequest body sent during test cases : ',req.body,'\n\n\n\n');
    var userId=req.session.userId;
   // console.log('userId inside the function creating blogs is : ',userId);
    users.findOne({
        where:{
            id:userId
          }
      }).then(user=>{
          blogs.create({
              headingOfBlog:heading,
              contentOfBlog:content,
              emailOfUser:user.email
            }).then(blogs=>{
            //    console.log('blogs table updated',blogs);
                res.redirect('/homePage');
              });
        }).catch(err=>{
           // console.log('Error while creating blog : ',err);
            res.redirect('/homepage');
          });
  }
function editBlogPage(req,res){
    const id=req.query.editBlogId;
    const {heading,content}=req.body;
  //  console.log('blog id : ',id,' heading : ',heading,' content : ',content);
    blogs.update({
          headingOfBlog:heading,
          contentOfBlog:content
        },
        {
          where:{
            id:id
          }
      }).then(blog=>{
          console.log('updated!!!');
          res.redirect('/profile');
        }).catch(err=>{
          //  console.log(err);
            res.redirect('/profile');
          })
  }
function upvote(req,res){
    const  userId=req.session.userId;
    const blogId=req.query.blogId || req.body.blogId;
    // console.log(req);
    // console.log('Inside upvote : userId :',userId,' blogId :',blogId);
    vote.findOne({
        where:{
            blogId:blogId,
            userId:userId
          }
      }).then(votes=>{
          if(votes){
            var upresult,downresult;
            if(votes.upvoted){
              upresult=false;
              downresult=false;
            }
            else if(votes.downvoted){
              upresult=true;
              downresult=false;
            }
            else{
              upresult=true;
              downresult=false;
            }
            vote.update({
                blogId:blogId,
                userId:userId,
                upvoted:upresult,
                downvoted:downresult
              },{
              where:{
                  blogId:blogId,
                  userId:userId
                }
              }).then(vote=>{
                  console.log('Upvote updated');
                  res.redirect('/blogshow?id='+blogId);
                }).catch(err=>{
                    console.log('Error while updating upvote');
                    res.redirect('/blogshow?id='+blogId);
                  });

          }
          else{
              vote.create({
                  blogId:blogId,
                  userId:userId,
                  upvoted:true
                }).then(vote=>{
                    console.log('Upvoted');
                    res.redirect('/blogshow?id='+blogId);
                  }).catch(err=>{
                     // console.log('Error while upvoting ',err);
                      res.redirect('/blogshow?id='+blogId);
                    });
            }
        }).catch(err=>{
            console.log('Error while fetching the vote in upvote section',err);
            res.redirect('/blogshow?id='+blogId);
          });
  }
function downvote(req,res){
    var userId=req.session.userId;
    var blogId=req.query.blogId || req.body.blogId;
   // console.log('Inside downvote : userId :',userId,' blogId :',blogId);
    vote.findOne({
        where:{
            blogId:blogId,
            userId:userId
          }
      }).then(votes=>{
          if(votes){
            var result;
            if(votes.upvoted){
              upresult=false;
              downresult=true;
            }
            else if(votes.downvoted){
              upresult=false;
              downresult=false;
            }
            else{
              upresult=false;
              downresult=true;
            }
            vote.update({
                blogId:blogId,
                userId:userId,
                upvoted:upresult,
                downvoted:downresult
              },{
              where:{
                  blogId:blogId,
                  userId:userId
                }
              }).then(vote=>{
                  console.log('downvote updated');
                  res.redirect('/blogshow?id='+blogId);
                }).catch(err=>{
                    console.log('Error while updating upvote');
                    res.redirect('/blogshow?id='+blogId);
                  });
          }
          else{
              vote.create({
                  blogId:blogId,
                  userId:userId,
                  downvoted:true
                }).then(vote=>{
                    console.log('downvoted');
                    res.redirect('/blogshow?id='+blogId);
                  }).catch(err=>{
                      console.log('Error while downvoting ');
                     res.redirect('/blogshow?id='+blogId);
                    });
            }
        }).catch(err=>{
            console.log('Error while fetching the vote in downvote section',err);
           res.redirect('/blogshow?id='+blogId);
          });
  }
function comment(req,res){
    const userId=req.session.userId;
    const blogId=req.query.blogId || req.body.blogId;
    const { usercomment }= req.body ;
    users.findOne({
      where:{
        id:userId
        }
    }).then(user=>{
        comments.create({
        comment:usercomment,
        username:user.name,
        blogId:blogId
        }).then(comments=>{
            console.log('comment table updated : ');
            res.redirect('/blogshow?id='+blogId);
          }).catch(err=>{
              //console.log('Error while updating the comments table : ',err);
              res.redirect('/blogshow?id='+blogId);
            });
        });
  }
module.exports = {
  loginPage: loginPage,
  signupPage: signupPage,
  blogPage: blogPage,
  editBlogPage:editBlogPage,
  upvote:upvote,
  downvote:downvote,
  comment:comment
};
