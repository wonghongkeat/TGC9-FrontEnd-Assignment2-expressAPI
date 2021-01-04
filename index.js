// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')


// load in environment variables
require('dotenv').config();

// create the app
const app = express();
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.json());
app.use(cors())


async function main() {
    const MONGO_URL = process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_assignment2");
    let db = MongoUtil.getDB();

    // to retrieve the database
    app.get('/', async function (req, res) {
        let listings = await db.collection('levels').find().toArray()
        res.send(listings)

    })

    // to retrieve specific data
    app.get('/:id', async function (req, res) {
        let score = await db.collection('levels').findOne({
            '_id': ObjectId(req.params.id)
        })
        res.send(score)
    })

    // to delete
    app.delete('/:id', async function (req, res) {
        await db.collection('levels').deleteOne({
            _id: ObjectId(req.params.id)
        })
        res.send({
            'status': 'ok'
        })
    })
    //to edit
    app.patch('/:id', async function (req, res) {
        let { playerScore } = req.body
        console.log('plaer')
        await db.collection('levels').updateOne({
            '_id': ObjectId(req.params.id)},{
            '$push': {
                'player': playerScore
            }
        }
        )
        res.send('update done')
    })

    // to create
    app.post('/create', async function (req, res) {
        let {name, score} = req.body
        await db.collection('levels').insertOne({
            
            name, score
        })
        res.send('new info created')
    })






}

main()
app.listen(3000, () => {
    console.log("Express is running")
})