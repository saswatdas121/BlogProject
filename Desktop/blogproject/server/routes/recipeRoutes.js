//"Routes" to forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions.

const express=require('express');
const router=express.Router();//Express Routers are a way to organize your Express application such that your primary app.js file does not become bloated and difficult to reason about
const blogsController=require('../controllers/recipeController');


const db=require('../models/database');


router.get('/home',blogsController.homepage);

router.get('/categories',blogsController.explorePage)

router.get('/blogs/:id',blogsController.blogPage)

router.get('/category/:id',blogsController.totalBlogsPage)

router.get('/submit',blogsController.submitForm)

module.exports=router;