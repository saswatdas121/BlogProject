const express=require('express');
const app=express();
const path=require('path');
const db=require('./server/models/database');


app.set('view engine','ejs');
app.use(express.static('public'));

const routes=require('./server/routes/recipeRoutes.js');
app.use('/',routes);//It checks for all routes which starts with /.

db.connectToDatabase().then(function()
{
    app.listen(3000);
});