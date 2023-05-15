//"Routes" to forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions.

const express=require('express');
const router=express.Router();//Express Routers are a way to organize your Express application such that your primary app.js file does not become bloated and difficult to reason about
const blogsController=require('../controllers/blogsController');
const passport=require('passport')

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

router.get('/guest',blogsController.guest);

router.get('/google',passport.authenticate("google",
{
  scope:['profile','email']//Which items are accessible from the user
}));//1)First when we sign in with google browser(/auth/google) then we need to handle the request in our node application.Then we need to grant permission from the user by sending them a consent screen


//passport.authenticate('google') sending the consent screen to the user.Passport object calls Google strategy 

 router.get('/auth/google/redirect',passport.authenticate('google'),blogsController.googleAuthentication)

//2)When user granted a permission then it redirects to a callback route.Google gives us a code in the redirect uri.Then Google gives a code in URI.We can tell passport for exchanging the code by profile info.
//A middleware set up so that when user gives its consent we can take the data and render accordingly 



module.exports=router; 