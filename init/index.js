const path = require("path");
require('dotenv').config({path: path.resolve(__dirname,'../.env')});
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL=process.env.MONGODB;

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

console.log(MONGO_URL)
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"6829863ebe73bd973bf3d72a"}));
    await Listing.insertMany(initData.data);
    console.log(initData.data);
    console.log("data was initialized");
}
initDB();