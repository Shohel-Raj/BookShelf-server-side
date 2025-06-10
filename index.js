require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@bookshelf.ikzrbq1.mongodb.net/?retryWrites=true&w=majority&appName=Bookshelf`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res) => {
  res.send('Bookshelf server is runing')
})





async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('bookshelfDB')
    const bookshelfColletion = database.collection('BooksCollection')


    app.get('/books', async (req, res) => {
      const { emailParams } = req.query;
      let quary = {}


      if (emailParams) {
        quary = { userEmail: { $regex: `^${emailParams}$`, } }
      }

      const result = await bookshelfColletion.find(quary).toArray();
      res.send(result)
    })


    app.get('/filtered', async (req, res) => {
      const { category } = req.query;
      const { search } = req.query;

      let quary = {

      }

      if (category) {
        quary = { reading_status: { $regex: `^${category}$`, $options: 'i' } }
      }

      if (search) {
        quary = { book_title: { $regex: search, $options: 'i' } }
      }

      const result = await bookshelfColletion.find(quary).toArray();
      res.send(result)
    })

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }

      const result = await bookshelfColletion.findOne(quary);

      res.send(result)
    })

    app.post('/addBook', async (req, res) => {
      const newBook = req.body
      const result = await bookshelfColletion.insertOne(newBook);
      res.send(result)
    })

    app.put('/book/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const UpdatePlant = req.body;

      const updateDoc = {
        $set: UpdatePlant
      }
      const result = await bookshelfColletion.updateOne(filter, updateDoc);

      res.send(result)

    });

    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };

      const result = await bookshelfColletion.deleteOne(quary)


      res.send(result)


    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('server runing on port ', port);
})