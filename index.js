const express = require("express");
require('dotenv').config();
const cors = require("cors");
const port = process.env.PORT || 5000;

const  app = express();

//middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jimwvxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

     const database = client.db("FoodCycleDB");
     const categoriesCollection = database.collection("categories");
     const foodWiseCollection = database.collection("food_wise");

     app.get("/categories",async(req,res)=>{
        const result = await categoriesCollection.find().toArray();
        res.send(result);

     })
     app.get("/foodWise", async (req, res) => {
       const result = await foodWiseCollection.find().toArray();
       res.send(result);
     });


    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("Welcome to Food Cycle Server");
})

app.listen(port,()=>{
    console.log(`Food Cycle Server is running at : http://localhost:${port}`);
})