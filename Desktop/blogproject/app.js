const express=require('express');
const app=express();
const path=require('path');
const db=require('./server/models/database');
const session=require('express-session');
const mongodbStore=require('connect-mongodb-session');

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
app.use(function(req,res,next)
{
    let isAuthenticated=req.session.user;

    if(isAuthenticated==null)
    {
        return next();
    }

    res.locals.isAuthenticated=true;

    next();


})

app.use('/',routes);//It checks for all routes which starts with /.

db.connectToDatabase().then(function()
{
    app.listen(3000);
});