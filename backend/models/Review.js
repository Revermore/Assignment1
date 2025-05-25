import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Static method to calculate average
// reviewSchema.statics.calculateAverageRating = async function (bookId) {
//   const result = await this.aggregate([
//     { $match: { book: bookId } },
//     {
//       $group: {
//         _id: "$book",
//         avgRating: { $avg: "$rating" },
//       },
//     },
//   ]);

//   const avg = result.length > 0 ? result[0].avgRating : 0;

//   await mongoose.model("Book").findByIdAndUpdate(bookId, {
//     averageRating: avg,
//   });
// };

// // Automatically update avg rating after save
// reviewSchema.post("save", function () {
//   this.constructor.calculateAverageRating(this.book);
// });

// // Automatically update avg rating after delete
// reviewSchema.post("findOneAndDelete", function (doc) {
//   if (doc) {
//     doc.constructor.calculateAverageRating(doc.book);
//   }
// });

export default mongoose.model("Review", reviewSchema);
