//Controller functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser.
const mongodb=require('mongodb');
const db = require('../models/database');
const { use } = require('../routes/recipeRoutes');
const bcrypt=require('bcryptjs');


const ObjectId=mongodb.ObjectId;

exports.homepage = async (req, res) => {
    const dataArray = await db.getDb().collection('categories').find({}).limit(3).toArray();
    const latestBlogs=await db.getDb().collection('blogs').find({},{title:1,imagePath:1,description:1,_id:1}).sort({_id:-1}).limit(5).toArray();//As we wanted the latest post first so we sorted it in descending order and limit is done to limit the documents
    //find({},{title:1}) this second parameter of find is projection.So we could ensure which key values we want as return
    res.render('homepage', { dataArray: dataArray,latestBlogs:latestBlogs});
}

exports.explorePage=async(req,res)=>
{
    const dataArray=await db.getDb().collection('categories').find({}).toArray();
    res.render('categories',{dataArray:dataArray});
}

exports.blogPage=async(req,res)=>
{
    try
    {
    let id=req.params.id;

  const blog=await db.getDb().collection('blogs').find({_id:new ObjectId(id)}).toArray();

  res.render('blogPage',{blog:blog})

}
catch(error)
{
    console.log(error);
}
}

exports.totalBlogsPage=async(req,res)=>
{
    try{
        let category=req.params.id;

        let blogsArray=await db.getDb().collection('blogs').find({category:category}).toArray();
    
        res.render('totalBlogs',{blogsArray:blogsArray,category:category})
    }
    catch(error)
    {
        console.log(error);
    }
    
}

exports.submitForm=async(req,res)=>
{
    res.render('submit',{error:''});
}

exports.submitRecipe=async(req,res)=>
{
    const fileImage=req.file;
    const userData=req.body;

    

    let blogCheck=await db.getDb().collection('blogs').find({title:userData.title,authorName:userData.name,email:userData.email,description:userData.description,category:userData.category}).toArray();

    if(blogCheck.length!=0)
    {
        return res.render('submit',{error:'You have already submiited the Blog.Try writing new one'});
    }
    let titleCheck=await db.getDb().collection('blogs').find({title:userData.title}).toArray();

    let emailCheck=await db.getDb().collection('blogs').find({email:userData.email}).toArray();

    if(emailCheck.length!=0)
    {
         if(emailCheck[0].authorName.trim()!=userData.name.trim())
         {
            let message='Email Id is already used';
            return res.render('submit',{error:message});
         }
    }
    if(titleCheck.length!=0)
    {
       return res.render('submit',{error:'Your Title should be unique'});
    }

    if(userData.description.trim().length<200)
    {
      return  res.render('submit',{error:'Description should be more than 100 characters'})
    }

    let path=fileImage.path;
    path=path.substring(6)
    let newObject={
        title:userData.title,
        description:userData.description,
        authorName:userData.name,
        email:userData.email,
        imagePath:path,
        date:new Date(),
        category:userData.category
    }


    let result=await db.getDb().collection('blogs').insertOne(newObject);

    res.redirect('/submitpage');
}

exports.submitPage=(req,res)=>
{
    res.render('submitPage')
}

exports.about=(req,res)=>
{
    res.render('about')
}

exports.login=(req,res)=>
{
    res.render('login');
}

exports.loginPost=async (req,res)=>
{
    const userData=req.body;

    let email=userData.email;
    let password=userData.password;

    let emailCheck=await db.getDb().collection('users').findOne({email:email});

    if(!emailCheck)
    {
        console.log("Email Doesnt Exist.Please Give valid credentials");
        return;
    }
    
    let passwordCheck=emailCheck.password;

    let comparePassword=bcrypt.compare(password,passwordCheck);

    if(!comparePassword)
    {
        console.log("Please Enter Valid Credentials");
        return;
    }

    req.session.user={
        email:email,
        id:emailCheck._id
    }

    req.session.save(function()
    {
        res.redirect('/home');
    })
    

}

exports.signup=(req,res)=>
{
    let tempData=req.session.tempData;
    req.session.tempData={
            fname:'',
            lname:'',
            email:'',
            confirmEmail:'',
            password:'' 
    }
    //We are doing the above thing as we are deleting the data which is present in the session after showing it one time.If we dont delete it iwt will keep on showing it
    res.render('signup',{tempData:tempData});
}

exports.signupUser=async (req,res)=>
{
    const userData=req.body;

    let fname=userData.fname;
    let lname=userData.lname;
    let email=userData.email;
    let confirmEmail=userData['confirm-email'];
    let password=userData.password;
    //place
    //add about but not in form

    if(password.trim().length<6 || email!==confirmEmail)
    {
        req.session.tempData={
            fname:fname,
            lname:lname,
            email:email,
            confirmEmail:confirmEmail,
            password:password,
            message:"Enter Correct Password or Confirm Email id"
        }
        
        req.session.save(function()
        {
            return res.redirect('/signup')
        })

        return;
       
    }
    

    const emailCheck=await db.getDb().collection('users').findOne({email:email});

    if(emailCheck)
    {
        req.session.tempData={
            fname:fname,
            lname:lname,
            email:email,
            confirmEmail:confirmEmail,
            password:password,
            message:"Email Already Exists.Try Sign in"
        }
        
        req.session.save(function()
        {
            return res.redirect('/signup')
        })

        return;
    }

    let hashedPassword=await bcrypt.hash(password,12)
    await db.getDb().collection('users').insertOne({fname:fname,lname:lname,email:email,confirmEmail:confirmEmail,password:hashedPassword});

    res.redirect('/login');
    

}

exports.profile=async (req,res)=>
{
   let user=req.session.user;
   if(user)
   {
    let userData=await db.getDb().collection('users').findOne({email:user.email})
    let blogsData=await db.getDb().collection('blogs').find({email:user.email}).toArray();
    return res.render('profile',{userData:userData,blogsData:blogsData});
   }

   res.render('profile',{userData:null,blogsData:null})
   
}

exports.logout=async (req,res)=>
{
    req.session.user=null;

    res.redirect('/login');
}

// let obj =
//     [
//         {
//             title: "Artificial Intellligence",
//             description: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence of humans and other animals. Example tasks in which this is done include speech recognition, computer vision, translation between (natural) languages, as well as other mappings of inputs.",
//             authorName: "Saswat",
//             imagePath: "/img/artificial-intelligence.webp",
//             date: new Date()
//         },
//         {
//             title: "Deep Learning",
//             description: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence of humans and other animals. Example tasks in which this is done include speech recognition, computer vision, translation between (natural) languages, as well as other mappings of inputs.",
//             authorName: "Saswat",
//             imagePath: "/img/artificial-intelligence.webp",
//             date: new Date()
//         },
//         {
//             title: "Blockchain",
//             description: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence of humans and other animals. Example tasks in which this is done include speech recognition, computer vision, translation between (natural) languages, as well as other mappings of inputs.",
//             authorName: "Saswat",
//             imagePath: "/img/artificial-intelligence.webp",
//             date: new Date()
//         },
//         {
//             title: "Artificial Intellligence",
//             description: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence of humans and other animals. Example tasks in which this is done include speech recognition, computer vision, translation between (natural) languages, as well as other mappings of inputs.",
//             authorName: "Saswat",
//             imagePath: "/img/artificial-intelligence.webp",
//             date: new Date()
//         },
//         {
//             title: "Internet of Things",
//             description: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence of humans and other animals. Example tasks in which this is done include speech recognition, computer vision, translation between (natural) languages, as well as other mappings of inputs.",
//             authorName: "Saswat",
//             imagePath: "/img/artificial-intelligence.webp",
//             date: new Date()
//         }

//     ]

//     async function insertdata()
//     {
//         await db.getDb().collection('blogs').insertMany(obj);
//     }









