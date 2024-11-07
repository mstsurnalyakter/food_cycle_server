const express = require("express");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

//middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jimwvxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("FoodCycleDB");
    const categoriesCollection = database.collection("categories");
    const foodWiseCollection = database.collection("food_wise");
    const childContentsCollection = database.collection("child_contents");
    const quizCollection = database.collection("quiz");
    const foodFreshnessGuidCollection = database.collection("food_freshness_guid");

    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });

    app.get("/foodWise", async (req, res) => {
      const result = await foodWiseCollection.find().toArray();
      res.send(result);
    });

    app.get("/food_wise/:id", async (req, res) => {
      const result = await foodWiseCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.get("/child_contents", async (req, res) => {
      const result = await childContentsCollection.find().limit(5).toArray();
      res.send(result);
    });

    app.get("/child_contents/:id", async (req, res) => {
      const result = await childContentsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.get("/quiz/:commonId", async (req, res) => {
      const query = {
        commonId: req.params.commonId,
      };
      console.log(req.params.commonId);
      const result = await quizCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/quiz/submit/:commonId", async (req, res) => {
      const { commonId } = req.params;
      const { answers } = req.body; // answers will be an array of selected answers from the front-end

      const quizData = await quizCollection.findOne({ commonId });

      // Compare the user's answers to the correct ones in the quiz data
      let score = 0;
      const result = quizData.exam_details.map((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.answer;

        if (isCorrect) {
          score++;
        }

        return {
          ...question,
          userAnswer,
          isCorrect,
        };
      });

      res.send({
        score,
        totalQuestions: quizData.exam_details.length,
        result, // This will include the questions with user answers and correctness status
      });
    });

     app.get("/food_freshness_guid", async (req, res) => {
       const result = await foodFreshnessGuidCollection.find().toArray();
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

app.get("/", (req, res) => {
  res.send("Welcome to Food Cycle Server");
});

app.listen(port, () => {
  console.log(`Food Cycle Server is running at : http://localhost:${port}`);
});
