// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;


// load in environment variables
require('dotenv').config();

// create the app
const app = express();
app.set('view engine','hbs')
app.use(express.static('public'))


async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_assignment2");
    let db = MongoUtil.getDB();

    app.get('/', async function(req,res){
        let listings = await db.collection('players_score').find().toArray()
        res.send(listings)
      
    })

    app.get('/:id', async function(req,res){
        let score = await db.collection('players_score').findOne({
            '_id':ObjectId(req.params.id)
        })
        res.send(score)
    })






}

main()
app.listen(3000, ()=>{
    console.log("Express is running")
})