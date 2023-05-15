const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20');
const db=require('../models/database')

//Require this in app.js(IMPORTANT)

//4)Then we need to create a session so that we know user is authenticated.So we use serializeUser() to create a session.
//The value is stored in req.session.passport.user=user.email in our case.So a session will be created with email data.
//serializeUser is the method that is called on the login request(during the authentication) 
//and if login is successful then it decides what user information should get stored in the session and a cookie is sent to the browser for the same to maintain the session.

passport.serializeUser((user,done)=>
{
    done(null,user.email);//A session is created will req.session.passport.user=user.email

});

//5)Then in subsequent requests it decodes the cookies and look up in the database of that session id 
//and send the email which is stored in the session/database to deserialzeUser() function.


//6)deserializeUser is the method that is called on all subsequent request and is called by the 
//passport.session middleware(in app.js). It enables us to load additional user information on every request
//(In this we are collecting user information).This user object is attached to the request as req.user making it accessible in our request handling.
//done(null,userData)-->userData is attached with req.user to make it accessible for request handling


passport.deserializeUser(async (id,done)=>
{
    let userData=await db.getDb().collection('users').findOne({email:id});
    done(null,userData);//Now for all route handlers we can use req.user as userData is attached to req.user
})



passport.use(new GoogleStrategy({

    //Options for google strategy
    callbackURL:'/auth/google/redirect',//Whenever user gives consent then it redirects to this url
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET
    
},async (acessToken,refreshToken,profile,done)=>
{
    // 3)We can get the profile information by a callback function which gets trigger when user gives its consent.
    //So now we got the profile information then we need to store the user in the database.If user already exist then we dont need to store it.
    //So after storing we willl pass the userData to done() function.done() function calls passport.serialize()

    //done() function--> When success is called, it can attach the user to the request or do other things, depending on your needs (it looks for the options you pass to passport.authenticate). 
    //If you want to determine when next will be called, you should use custom callback which gives you more flexibility. 

    let userData=await db.getDb().collection('users').findOne({email:profile.emails[0].value});
    if(!userData)
    {
        await db.getDb().collection('users').insertOne({fname:profile.name.givenName,lname:profile.name.familyName,googleId:profile.id,email:profile.emails[0].value,password:'',confirmEmail:profile.emails[0].value})
    }

    userData=await db.getDb().collection('users').findOne({email:profile.emails[0].value});
    done(null,userData);//This moves to serializeUser
    //Passport call back function.When it comes back by exchanging the code with the profile information
})
)

//Strategy are different authetication system.In this we use Google strategy.
//We want to use google api to authenticate people inside our website. 