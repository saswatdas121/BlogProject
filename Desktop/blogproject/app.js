const express=require('express');
const app=express();
const path=require('path');
const db=require('./server/models/database');
const session=require('express-session');
const mongodbStore=require('connect-mongodb-session');
const passportSetup=require('./server/models/passport-setup')
const passport=require('passport')

app.use(express.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.use(express.static('public'));
// app.use('/',express.static('image'));

require('dotenv').config({
    path: 'C:/Users/Shubham/Desktop/blogproject/config.env'
})

const MongoDBStore=mongodbStore(session);

const sessionStore=new MongoDBStore({
    uri:process.env.MONGODB_URI,
    databaseName:'a',
    collection:'sessions'
  })

const routes=require('./server/routes/recipeRoutes.js');



app.use(session(
    {
        secret:'super-secret',
        resave:false,
        saveUninitialized:false,
        store:sessionStore,
    }    
))

app.use(passport.initialize());
app.use(passport.session());//this calls deserialize which in turn attach the user object 
//to the request as req.user making it accessible in our request handling.

app.use(function(req,res,next)
{
    if(req.session.user || req.user)
    {
        res.locals.isAuthenticated=true;
    }

    next();



})//Run for every request

app.use('/',routes);//It checks for all routes which starts with /.

db.connectToDatabase().then(function()
{
    app.listen(3000);
});