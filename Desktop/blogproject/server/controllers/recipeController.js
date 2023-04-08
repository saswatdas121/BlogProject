//Controller functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser.
const mongodb=require('mongodb');
const db = require('../models/database');

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

  console.log(blog);

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


        let blogsArray=await db.getDb().collection('blogs').find({title:category}).toArray();
    
        res.render('totalBlogs',{blogsArray:blogsArray,category:category})
    }
    catch(error)
    {
        console.log(error);
    }
    
}

exports.submitForm=async(req,res)=>
{
    res.render('submit');
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









