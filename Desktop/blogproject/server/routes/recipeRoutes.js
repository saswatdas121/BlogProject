//"Routes" to forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions.

const express=require('express');
const router=express.Router();//Express Routers are a way to organize your Express application such that your primary app.js file does not become bloated and difficult to reason about
const blogsController=require('../controllers/blogsController');

const path=require('path');

const multer=require('multer');

const storageConfig=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'public/img');
    },//Where you file will be saved 
    filename:function(req,file,cb)
    {
       cb(null,Date.now()+'-'+file.originalname);
    }//Name of you file
  });



const upload=multer({storage:storageConfig});


router.get('/home',blogsController.homepage);

router.get('/categories',blogsController.explorePage)

router.get('/blogs/:id',blogsController.blogPage)

router.get('/category/:id',blogsController.totalBlogsPage)

router.get('/submit',blogsController.submitForm)

router.post('/submitrecipe',upload.single('image'),blogsController.submitRecipe)

router.get('/submitPage',blogsController.submitPage);

router.get('/about',blogsController.about);

router.get('/login',blogsController.login);

router.post('/loginuser',blogsController.loginPost);

router.get('/signup',blogsController.signup);

router.post('/signupuser',blogsController.signupUser);

router.get('/profile',blogsController.profile);

router.get('/logout',blogsController.logout);

module.exports=router; 