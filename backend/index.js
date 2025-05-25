import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bookRoutes from "./routes/bookRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // allows cookies/auth headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/books", bookRoutes);
app.use("/reviews", reviewRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Book Review API is up");
});

// app.get("/sample", async (req, res) => {
//   try {
//     // await User.deleteMany();
//     // await Book.deleteMany();
//     // await Review.deleteMany();

//     const sampleBooks = [
//       {
//         title: "Tess of the road",
//         author: "Rachel Hartman",
//         genre: "Supernatural Fiction",
//         description: "You're going to love this if you love dragons like me!",
//         coverImage:
//           "https://images.squarespace-cdn.com/content/v1/5ae2fce87e3c3ae275ea2c9f/1526464175408-W92Q4MSAM40I8YF4HM64/tess-cover.jpg?format=1500w",
//       },
//       {
//         title: "Haven Fall",
//         author: "Sara Holland",
//         genre: "Heart-Touching",
//         description: "Was it all in my head?",
//         coverImage:
//           "https://rocketexpansion.com/wp-content/uploads/2021/11/Haven-fall.jpg",
//       },
//       {
//         title: "Midnight caller",
//         author: "Elizabeth Jones",
//         genre: "Dark Romance",
//         description: "Meow",
//         coverImage:
//           "https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:65b67113-c586-55ff-b484-c13170df2e69/component?assetType=TEMPLATE&etag=2a1c7fea787442f8a78506e286f63e2e&revision=724ce2f7-55e7-4f76-b3fc-ec3e8f1e398b&component_id=db2f32b4-2bc2-4d8c-a8ce-af38ea493991",
//       },
//       {
//         title: "Harry Potter and the goblet of fire",
//         author: "J.K.Rowling",
//         genre: "Comedy",
//         description: "Explore the fantasy world of Harry Potter",
//         coverImage:
//           "https://contentful.harrypotter.com/usf1vwtuqyxm/3d9kpFpwHyjACq8H3EU6ra/85673f9e660407e5e4481b1825968043/English_Harry_Potter_4_Epub_9781781105672.jpg",
//       },
//     ];

//     const books = await Book.insertMany(sampleBooks);
//     console.log("Sample books added");

//     // const adminPassword = await bcrypt.hash("admin123", 10);
//     // const userPassword = await bcrypt.hash("user123", 10);

//     // const users = await User.insertMany([
//     //   {
//     //     username: "AdminBro",
//     //     email: "admin@example.com",
//     //     password: adminPassword,
//     //     role: "admin",
//     //   },
//     //   {
//     //     username: "UserOne",
//     //     email: "user1@example.com",
//     //     password: userPassword,
//     //     role: "user",
//     //   },
//     //   {
//     //     username: "UserTwo",
//     //     email: "user2@example.com",
//     //     password: userPassword,
//     //     role: "user",
//     //   },
//     //   {
//     //     username: "UserThree",
//     //     email: "user3@example.com",
//     //     password: userPassword,
//     //     role: "user",
//     //   },
//     // ]);
//     // console.log("Users added");

//     // await Review.insertMany([
//     //   {
//     //     book: books[0]._id,
//     //     user: users[1]._id,
//     //     rating: 5,
//     //     comment: "Mmmm that's a lot of intuition lol.",
//     //   },
//     //   {
//     //     book: books[0]._id,
//     //     user: users[2]._id,
//     //     rating: 4,
//     //     comment:
//     //       "Spicy, very well written, the way the characters point of view is described and the details makes me easily imagine the whole thing like I'm standing there and watching everything play out",
//     //   },
//     //   {
//     //     book: books[1]._id,
//     //     user: users[1]._id,
//     //     rating: 2,
//     //     comment: "I don't wanna explore the now ever again.",
//     //   },
//     //   {
//     //     book: books[2]._id,
//     //     user: users[3]._id,
//     //     rating: 4,
//     //     comment:
//     //       "I'm scared of my own shadow lol. This book was more thrilling than I expected it to be.",
//     //   },
//     //   {
//     //     book: books[3]._id,
//     //     user: users[3]._id,
//     //     rating: 5,
//     //     comment:
//     //       "I can't believe they removed so much detail from the movie!! This book is magnificent.",
//     //   },
//     // ]);
//     // console.log("Reviews added");

//     res.status(200).json({ message: "Sample data added" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/b", async (req, res) => {
//   try {
//     const books = await Book.find();
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/r", async (req, res) => {
//   try {
//     const review = new Review({
//       ...req.body,
//     });
//     await review.save();
//     const book = await Book.findById(req.body.book);
//     console.log(book);
//     const updatedCount = (book.ratingsCount || 0) + 1;
//     const updatedAvg =
//       ((book.averageRating || 0) * (updatedCount - 1) + req.body.rating) /
//       updatedCount;
//     book.averageRating = updatedAvg;
//     book.ratingsCount = updatedCount;
//     await book.save();

//     res.status(201).json(review);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log("Server running on port " + process.env.PORT)
    );
  })
  .catch((err) => console.error("MongoDB error: ", err));
