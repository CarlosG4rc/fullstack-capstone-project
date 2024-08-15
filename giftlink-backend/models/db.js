// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient("mongodb://localhost:27017/");      

    await client.connect();
    dbInstance = client.db("giftdb");
    return dbInstance;
}

module.exports = connectToDatabase;
