// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors())


async function main() {
    const MONGO_URL = process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_assignment2");
    let db = MongoUtil.getDB();

    // to retrieve the database
    app.get('/', async function (req, res) {
        let levels = await db.collection('levels').find().toArray()

        res.send(levels)

    })

    // to retrieve specific data
    app.get('/:id', async function (req, res) {
        let score = await db.collection('levels').findOne({
            '_id': ObjectId(req.params.id)
        })
        res.send(score)
    })

    // delete
    app.delete('/:id', async function (req, res) {
        await db.collection('levels').deleteOne({
            _id: ObjectId(req.params.id)
        })
        res.send({
            'status': 'ok'
        })
    })
    //edit
    app.patch('/:id', async function (req, res) {
        let { name, score} = req.body
        // console.log(playerScore)
        await db.collection('levels').updateOne({
            '_id': ObjectId(req.params.id)},{
            '$push': {
                'player': {name, score}
            }
        }
        )
        res.send('update done')

        
        // let player_score = await db.collection('players_score')
        // let newPlayer = player_score.find(({name:i}) => i === name)
        // if (newPlayer){
        //     await db.collection('players_score').insertOne({
        //         player_score.
        //     })
        // }
    })

    // create
    app.post('/create', async function (req, res) {
        let {name, score, level} = req.body
        await db.collection('players_score').insertOne({
            name, 
            level:{
                 [level]: [score]
                }
        })
        res.send('new info created')
    

    })

}

main()
app.listen(3000, () => {
    console.log("Express is running")
})