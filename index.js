const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5055;
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

console.log(process.env.DB_USER);
const app = express();
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qzzpx.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const ProductsCollection = client.db("fresh-valley").collection("Products");
  const OrderCollection = client.db("fresh-valley").collection("Order");

  app.post('/addProducts', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    ProductsCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result)
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    ProductsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((err, result) => {
      console.log(result);
    })
  })

  app.get('/products', (req, res) => {
    ProductsCollection.find({})
    .toArray((err, collections) => {
      console.log(collections)
      res.send(collections);
    })
  })


  app.get("/Inventory", (req, res) => {
    ProductsCollection.find({})
    .toArray((err, collections) => {
      res.send(collections);
      console.log('from database', collections)
    })
  })

  app.get("/order/:id", (req, res) => {
    ProductsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, collections) => {
      res.send(collections[0]);
    })
  })

  app.get('/order', (req, res) => {
    ProductsCollection.find({email:req.query.email})
    .toArray((err, collections) => {
      res.send(collections);
    })
  })
 
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log('product order collection', order);
    OrderCollection.insertOne(order)
    .then(result => {
      console.log('inserted count', result)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/ordered', (req, res) => {
    OrderCollection.find({email:req.query.email})
    .toArray((err, collections) => {
      res.send(collections);
    })
  })

  
});


app.get('/', (req, res) =>{
    res.send('Welcome to server !!!')
})

app.listen(port, () =>{
    console.log(`Listen to post at http://localhost:${port}`)
})