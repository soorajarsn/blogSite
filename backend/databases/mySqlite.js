const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage:'database.sqlite'
  });

const user = sequelize.define('user',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
      },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
    password:{
        type: Sequelize.STRING,
        allowNull : false
      }
  });
const blogs = sequelize.define('blogs',{
    headingOfBlog:{
        type: Sequelize.STRING,
        allowNull: false
      },
    contentOfBlog:{
        type: Sequelize.STRING,
        allowNull: false
      },
    emailOfUser:{
        type: Sequelize.STRING,
        allowNull: false
      }
  });
const vote=sequelize.define('vote',{
    blogId:{
        type: Sequelize.NUMBER,
        allowNull: false
      },
    upvoted:{
        type:Sequelize.BOOLEAN,
        allowNull: true
      },
    downvoted:{
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
    userId:{
        type: Sequelize.NUMBER,
        allowNull:false
      }
  });
const comments=sequelize.define('comments',{
    comment:{
        type:Sequelize.STRING,
        allowNull:false
      },
    username:{
        type: Sequelize.STRING,
        allowNull: false
      },
    blogId:{
        type: Sequelize.NUMBER,
        allowNull: false
      }
  });
sequelize.sync();
sequelize.sync();
sequelize.sync().then( _ =>{
    //console.log('Blogs table created successfully, if didn\'t exist');
  }).catch(err=>{
     // console.log('Error occured while creating blogs table : ',err);
    });
sequelize.sync().then(()=>{
   // console.log('users table has been successfully created, if one didn\'t exist');
  }).catch(err=>{
      console.log(err);
    });
//blogs.drop().then(_=>{console.log('deleted');}).catch(_=>{console.log('err deleting');});
module.exports={
  users:user,
  blogs:blogs,
  comments:comments,
  vote:vote
  };
