const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5cvzz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {

        await client.connect();
        const database = client.db('CryptoBase');
        const usersCollection = database.collection('Users');

        // Inserting new user
        app.post('/user', async(req, res) => {

            const result = await usersCollection.insertOne(req.body);
            res.json(result);
        });

        // Upserting user
        app.put('/user', async(req, res) => {

            const user = req.body;
            const filter = {email: user.email};
            const options = {upsert: true};
            const updated = {$set: user};
            const result = await usersCollection.updateOne(filter, updated, options);
            res.json(result);
        })

    } finally {

    }
}

run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('ok lets go')
})

app.listen(port, () => {
    console.log(`Running on Port ${port}`)
})