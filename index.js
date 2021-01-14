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



    // to retrieve the levels database
    app.get('/', async function (req, res) {
        let levels = await db.collection('levels').find().toArray()
        res.send(levels)
    })

    // edit from players_score
    app.get('/players_score/:name', async (req, res) => {
        let player = await db.collection("players_score").findOne({
            'name': req.params.name
        })
        res.send(player)
    })

    // to retrieve specific data from levels
    app.get('/level/:id', async function (req, res) {
        let score = await db.collection('levels').findOne({
            '_id': ObjectId(req.params.id)
        })
        res.send(score)
    })

    // delete from levels
    app.delete('/level/:id', async function (req, res) {
        await db.collection('levels').deleteOne({
            _id: ObjectId(req.params.id)
        })
        res.send({
            'status': 'ok'
        })
    })

    //edit from levels
    app.patch('/level/:id', async function (req, res) {
        let { name, score } = req.body
        await db.collection('levels').updateOne({
            '_id': ObjectId(req.params.id)
        }, {
            '$push': {
                'player': { name, score }
            }
        }
        )
        res.send('update done')
    })


    // to edit player score
    app.patch('/players_score/:name', async function (req, res) {
        let { score, level } = req.body;
        let levelString = `level.${level}`

        await db.collection("players_score").updateOne({
            'name': req.params.name
        }, {
            '$push': {
                [levelString]: score
            }
        })
        res.send({
            status: 'OK'
        })
    })

    // create from players_score
    app.post('/players_score/create', async function (req, res) {
        let { name, score, level } = req.body
        await db.collection('players_score').insertOne({
            name,
            level:
            {
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