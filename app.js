const express=require('express');
const logger=require('morgan');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const session=require('express-session');
const routes=require('./backend/routes/htmlRoutes');
const compression=require('compression');
const cors=require('cors');

const app=express();

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/client'));
app.use(logger('dev'));
app.use(cookieParser());
app.set('views',__dirname+'/client/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);



app.use(session({
    name:'user',
    secret:'soorajShukla',
    resave:false,
    saveUninitialized:false,
    cookie:{httpOnly:true,secure:false,masAge:1000*60*20}
  }));

app.use('/',routes);

app.set('port',process.env.PORT || 4000);

app.listen(app.get('port'),_=>{
    console.log('App started running at '+app.get('port'));
  });

module.exports=app;
