const dbConn=require('../databases/mySqlite');
const users=dbConn.users;
const blogs=dbConn.blogs;
const vote=dbConn.vote;
const comments=dbConn.comments;
function indexPage(req,res){
  if(!req.session.userId){
      res.redirect('/login');
    }
  else{
      res.redirect('/homepage');
    }
}

function homePage(req,res){
    if(req.session.userId){
        users.findOne({
            where:{
                id:req.session.userId
              }
          }).then(user=>{
              if(user){
                blogs.findAll({

                  }).then(blogs=>{
                      var blgs=[];
                      // console.log('blogs : ', blogs);
                      // console.log('just entering in for loop to calculate blgs array')
                      for(var i=blogs.length-1;i>=0;i--)
                        blgs.push(blogs[i].dataValues);

                      //  console.log('blgs : ',blgs);
                      res.render('homepage',{
                          username:user.name,
                          blogs:blgs
                        });
                    }).catch(err=>{
                      //  console.log('Error while fetching blogs :',err);
                        // res.render('homepage',{
                        //     username:user.name,
                        //     blogs:[]
                        //   });
                      });
                // res.render('homepage',{
                //     username:user.name,
                //     blogs:[]
                //   });
                }
                else{
                    console.log('no user found with this id');
                  }
            }).catch(err=>{
                console.log('Error : ',err);
              });
      }
    else{
        res.redirect('/login');
      }
  }

function loginPage(req,res){
    res.render('login');
  }
function signupPage(req,res){
    res.render('signup');
  }
function blogPage(req,res){
    res.render('blogpage');
  }
function profilePage(req,res){
    var userId=req.session.userId;
    users.findOne({
        where:{
            id:userId
          }
      }).then(user=>{
          blogs.findAll({
              where:{
                  emailOfUser:user.email
                }
            }).then(blogs=>{
                var blgs=[];
                for(var i=blogs.length-1;i>=0;i--)
                  blgs.push(blogs[i].dataValues);
                res.render('profile',{
                    username:user.name,
                    blogs:blgs
                  });
              })
        }).catch(err=>{
            //console.log('Error occured while fetching user for profile : ', err);
            res.redirect('/homepage');
          })
  }
function blogshow(req,res){
    const blogId=req.query.id;
    //console.log('blogId: ',blogId);
    blogs.findOne({
        where:{
            id:blogId
          }
      }).then(blog=>{
        //console.log('Inside blogs.findOne :blog.headingOfBlog:',blog.headingOfBlog);
        vote.findAll({
            where:{
              blogId:blogId
            }
          }).then(votes=>{
              var upvoteStatus,downvoteStatus,upvoteCounts=0,downvoteCounts=0;
              //console.log('Inside vote.findAll :\nblog.heading:',blog.headingOfBlog);
            //  console.log('/blog.content:',blog.contentOfBlog);
              for(var i=0;i<votes.length;i++){
                  rowData=votes[i].dataValues;
                  if(rowData.upvoted)
                    upvoteCounts++;
                  if(rowData.downvoted)
                    downvoteCounts++;
                  if(rowData.userId==req.session.userId){
                      upvoteStatus=rowData.upvoted;
                      downvoteStatus=rowData.downvoted;
                    }
                }
              comments.findAll({
                  where:{
                      blogId:blogId
                    }
                }).then(comments=>{
                    var cmnts=[];
                 //   console.log('Inside comments.findAll :\nblog.heading:',blog.headingOfBlog);
            //  console.log('/blog.content:',blog.contentOfBlog);
                    for(var i=0;i<comments.length;i++)
                      cmnts.push(comments[i].dataValues);
                    //  console.log('cmnts: ',cmnts);
                      //console.log('Going to render the blogshow page :')
                     // console.log('And values are :\n blog.heading :',blog.headingOfBlog);
                      //console.log('blog.content: ',blog.contentOfBlog);
                  //    console.log('')
                    res.render('blogshow',{
                        blog:blog,
                        upvoteCounts:upvoteCounts,
                        downvoteCounts:downvoteCounts,
                        upvoteStatus:upvoteStatus,
                        downvoteStatus:downvoteStatus,
                        comments:cmnts
                      });
                  }).catch(err=>{
                    //  console.log('Error while fetching comments : ',err);
                      res.redirect('/homepage');
                    });
            }).catch(err=>{
             //   console.log('Error while fetching the vote table : ',err);
                res.redirect('/homepage');
              })
          // console.log('Inside blogshow blog is : ', blog);
          // res.render('blogshow',{
          //     blog:blog
          //   });
        }).catch(err=>{
           // console.log('Error occured while fetching blog to show it : ',err);
            res.redirect('/homepage');
          });
  }
function editBlogPage(req,res){
  var  editBlogId =req.query.editBlogId;
  blogs.findOne({
      where:{
          id:editBlogId
        }
    }).then(blog=>{
        res.render('editblog',{
            heading:blog.headingOfBlog,
            content:blog.contentOfBlog,
            id:blog.id
          });
      }).catch(err=>{
        //  console.log('Error in editing the blog :',err);
          res.redirect('/homepage');
        });
}
function deleteBlogPage(req,res){
  const deleteBlogId=req.query.deleteBlogId;
//  console.log('req.query : ',req.query);
  blogs.destroy({
      where:{
          id:deleteBlogId
        }
    }).then(rows=>{
        console.log(rows,'affected while deleting the blog');
        res.redirect('/profile');
      }).catch(err=>{
         // console.log('Error while deleting the blog: ',err);
          res.redirect('/profile');
        });
}
module.exports={
  indexPage:indexPage,
  homePage:homePage,
  loginPage:loginPage,
  signupPage:signupPage,
  blogPage:blogPage,
  profilePage:profilePage,
  blogshow:blogshow,
  editBlogPage:editBlogPage,
  deleteBlogPage:deleteBlogPage
};
