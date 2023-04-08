//npm install mongodb just helps us with the connection with the database
//database.js managing the connection
//blog--database authors--collection and inside that data is known as document(Mongodb)
//bolg--database authors--table and inside that data is stored in rows and columns(SQL)

const mongodb=require('mongodb');
require('dotenv').config({
    path: 'C:/Users/Shubham/Desktop/blogproject/config.env'
})

const MongoClient=mongodb.MongoClient;

let database;

async function connect()
{
    const client=await MongoClient.connect(process.env.MONGODB_URI,
        {
            useNewUrlParser:true,
            useUnifiedTopology:true
        });//To connect mongodb running locally
    database=client.db('a');//To connect with a specified database
}

function getDb()
{
    if(!database)
    {
        throw {message:'Database connection not established'};
    }

    return database;
}

module.exports={
    connectToDatabase:connect,
    getDb:getDb
};
