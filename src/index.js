import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import OrdersRouter from "./modules/orders/orders.router.js";
// import CustomersRouter from "./models/customers/customer.router.js";
import UsersRouter from "./modules/users/users.router.js";

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://admin:admin@example-db.0ogvtfp.mongodb.net/?retryWrites=true&w=majority&appName=example-db"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB error"));

app.use("/api/users", UsersRouter);
app.use("/api/orders", OrdersRouter);
// app.use("/api/customers", CustomersRouter);

app.listen(3000, () => {
  console.log("node app is running");
});
