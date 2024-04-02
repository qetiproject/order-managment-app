import mongoose from "mongoose";
import { emailRegex } from "../../config/regex.js";
import Order from "../orders/order.model.js";
import { getOrders } from "../orders/orders.service.js";

function vaidateUsername(username) {
  const firstThree = username.slice(0, 3);
  if (firstThree !== "GT_") {
    return false;
  }
  if (username.length < 4 || username.length > 20) {
    return false;
  }
  return true;
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [4, "minimum length is 4 characters"],
    maxLength: [20, "maximum length is 20 characters"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [4, "minimum length is 4 characters"],
    maxLength: [20, "maximum length is 20 characters"],
  },
  username: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: vaidateUsername,
      message: "Please enter valid username",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: [emailRegex, "Please enter valid email address"],
  },
  age: {
    type: Number,
    required: true,
    min: [18, "Minimum age is 18"],
    max: [100, "Maximum age is 100"],
  },
  role: {
    type: String,
    enum: ["logist", "customer"],
  },
  logistOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  customerOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

userSchema.post("deleteOne", { document: true }, async function (doc, next) {
  if (doc.role == "logist") {
    await Order.updateMany({ logist: doc._id }, { logist: null });
    return next();
  }
  if (doc.role == "customer") {
    const customerOrders = await getOrders(doc._id);

    for (const order of customerOrders) {
      await Order.deleteMany({ customer: doc._id });
    }

    return next();
  }
});
export default mongoose.model("User", userSchema);
