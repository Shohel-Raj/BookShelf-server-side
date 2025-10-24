require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  LEGAL_TCP_SOCKET_OPTIONS,
} = require("mongodb");

// const firebaseKey=Buffer.from(process.env.Firebase_admin,'base64').toString('utf8')

// const serviceAccount = JSON.parse(firebaseKey);
var serviceAccount = require("./firebaseAdminJdk.json");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@bookshelf.ikzrbq1.mongodb.net/?retryWrites=true&w=majority&appName=Bookshelf`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const varifyFirebasetoken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ massage: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ massage: "unauthorized access" });
  }
};

app.get("/", (req, res) => {
  res.send("Bookshelf server is runing");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("bookshelfDB");
    const bookshelfColletion = database.collection("BooksCollection");
    const bookshelfReview = database.collection("reviews");
    const userRole = database.collection("user");
    const userSubscriptions = database.collection("subscription");
    const contactMessages=database.collection("contuct-massage")

    app.get("/books", varifyFirebasetoken, async (req, res) => {
      const { emailParams } = req.query;

      if (emailParams) {
        if (emailParams !== req.decoded.email) {
          return res.status(404).send({ massage: "forbidden access" });
        }
      }

      let quary = {};

      if (emailParams) {
        quary = { userEmail: { $regex: `^${emailParams}$` } };
      }

      const result = await bookshelfColletion.find(quary).toArray();
      res.send(result);
    });

    app.get("/filtered", varifyFirebasetoken, async (req, res) => {
      const { category } = req.query;
      const { search } = req.query;
      const { catagories, emailParams } = req.query;

      if (emailParams) {
        if (emailParams !== req.decoded.email) {
          return res.status(404).send({ massage: "forbidden access" });
        }
      }

      let quary = {};

      if (catagories) {
        quary.book_category = { $regex: catagories, $options: "i" };
      }

      if (emailParams) {
        quary.userEmail = { $regex: `^${emailParams}$`, $options: "i" };
      }

      if (category) {
        quary = { reading_status: { $regex: `^${category}$`, $options: "i" } };
      }

      if (search) {
        quary = { book_title: { $regex: search, $options: "i" } };
      }

      const result = await bookshelfColletion.find(quary).toArray();
      res.send(result);
    });
    app.get("/filtereds", async (req, res) => {
      const { category } = req.query;
      const { search } = req.query;
      const { catagories, emailParams } = req.query;

      if (emailParams) {
        if (emailParams !== req.decoded.email) {
          return res.status(404).send({ massage: "forbidden access" });
        }
      }

      let quary = {};

      if (catagories) {
        quary.book_category = { $regex: catagories, $options: "i" };
      }

      if (emailParams) {
        quary.userEmail = { $regex: `^${emailParams}$`, $options: "i" };
      }

      if (category) {
        quary = { reading_status: { $regex: `^${category}$`, $options: "i" } };
      }

      if (search) {
        quary = { book_title: { $regex: search, $options: "i" } };
      }

      const result = await bookshelfColletion.find(quary).toArray();
      res.send(result);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };

      const result = await bookshelfColletion.findOne(quary);

      res.send(result);
    });

    app.post("/addBook", varifyFirebasetoken, async (req, res) => {
      const newBook = req.body;
      const result = await bookshelfColletion.insertOne(newBook);
      res.send(result);
    });
    app.post("/user-role", async (req, res) => {
      const userData = req.body;
      const result = await userRole.insertOne(userData);
      res.send(result);
    });
    // 🔹 GET: Get user role by email
    app.get("/get-user-role", varifyFirebasetoken, async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res
            .status(400)
            .json({ message: "Email query parameter is required" });
        }

        const user = await userRole.findOne({ email: email });

        if (!user) {
          return res.status(404).json({ message: "User role not found" });
        }

        res.status(200).json({
          message: "User role fetched successfully",
          role: user.role,
          user,
        });
      } catch (error) {
        console.error("Error fetching user role:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/subscription", async (req, res) => {
      const subscriptionUser = req.body;
      const result = await userSubscriptions.insertOne(subscriptionUser);
      res.send(result);
    });

    app.put("/book/:id", varifyFirebasetoken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const UpdatePlant = req.body;

      const updateDoc = {
        $set: UpdatePlant,
      };
      const result = await bookshelfColletion.updateOne(filter, updateDoc);

      res.send(result);
    });

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const UpdatePlant = req.body;

      const updateDoc = {
        $set: UpdatePlant,
      };
      const result = await bookshelfColletion.updateOne(filter, updateDoc);

      res.send(result);
    });

    app.get("/hightestUpvoto", async (req, res) => {
      const result = await bookshelfColletion
        .aggregate([
          {
            $sort: { upvote: -1 },
          },
          { $limit: 6 },
        ])
        .toArray();

      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };

      const result = await bookshelfColletion.deleteOne(quary);

      res.send(result);
    });

    // --------------------review section -----------------------

    app.post("/review", async (req, res) => {
      const review = req.body;
      const { bookId, emailParams } = req.query;
      const result = await bookshelfReview.insertOne(review);
      res.send(result);
    });

    app.get("/review/:id", varifyFirebasetoken, async (req, res) => {
      const id = req.params.id;
      const query = { book_id: id };

      const result = await bookshelfReview.find(query).toArray();

      res.send(result);
    });

    app.patch("/review/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const UpdateReview = req.body;

      const updateDoc = {
        $set: UpdateReview,
      };

      const result = await bookshelfReview.updateOne(filter, updateDoc);

      res.send(result);
    });

    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };

      const result = await bookshelfReview.deleteOne(quary);

      res.send(result);
    });

    // admin
    // 🔹 Admin Overview
    app.get("/admin/overview", varifyFirebasetoken, async (req, res) => {
      try {
        // Optional: Only allow admins
        const requestingUser = await userRole.findOne({
          email: req.decoded.email,
        });
        if (!requestingUser || requestingUser.role !== "admin") {
          return res.status(403).json({ message: "Forbidden. Admins only." });
        }

        const totalUsers = await userRole.countDocuments();
        const totalBooks = await bookshelfColletion.countDocuments();
        const totalReviews = await bookshelfReview.countDocuments();
        const totalSubscriptions = await userSubscriptions.countDocuments();

        const topBooks = await bookshelfColletion
          .find()
          .sort({ upvote: -1 })
          .limit(5)
          .toArray();

        res.status(200).json({
          totalUsers,
          totalBooks,
          totalReviews,
          totalSubscriptions,
          topBooks,
        });
      } catch (error) {
        console.error("Error fetching admin overview:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Submit contact message
app.post("/contact-us-by-user", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const newMessage = {
      name,
      email,
      subject: subject || "",
      message,
      createdAt: new Date(),
    };

    const result = await contactMessages.insertOne(newMessage);

    res.status(201).json({
      message: "Your message has been received",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get all contact messages (admin only)
app.get("/contact-us", varifyFirebasetoken, async (req, res) => {
  try {
    const requestingUser = await userRole.findOne({ email: req.decoded.email });
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admins only." });
    }

    const messages = await contactMessages.find().sort({ createdAt: -1 }).toArray();

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


    // // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server runing on port ", port);
});
