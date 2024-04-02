import mongoose from "mongoose";
import User from "../users/user.model.js";

const OrderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [20, "minimum length is 20 characters"],
    maxLength: [200, "maximum length is 200 characters"],
  },
  logist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

OrderSchema.post("deleteOne", { document: true }, async function (doc, next) {
  try {
    await User.findByIdAndUpdate(doc.customer, {
      $pull: { customerOrders: doc._id },
    });
  } catch (error) {}

  try {
    await User.findByIdAndUpdate(doc.logist, {
      $pull: { logistOrders: doc._id },
    });
  } catch (error) {}
  next();
});

export default mongoose.model("Order", OrderSchema);
