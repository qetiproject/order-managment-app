import Order from "./order.model.js";
import User from "../users/user.model.js";
import { getUserById } from "../users/users.service.js";

export async function createOrder(body) {
  const { customer, title } = body;
  const user = await getUserById(customer);
  if (user.role !== "customer") {
    throw new Error("Only customers can create orders");
  }
  const newOrder = new Order({ title, customer });
  await newOrder.save();

  await User.findByIdAndUpdate(user._id, {
    $push: { customerOrders: newOrder._id },
  });

  return newOrder;
}

export async function getOrders(customer, logist, strongFilter) {
  const query = {};
  const statements = [];

  if (customer != undefined) {
    statements.push({ customer: { $eq: customer } });
  }

  if (logist != undefined) {
    statements.push({ logist: { $eq: logist } });
  }

  if (statements.length > 0 && strongFilter) query.$and = statements;
  if (statements.length > 0 && !strongFilter) query.$or = statements;

  const orders = await Order.find(query).populate([
    { path: "customer", select: "firstName lastName" },
    { path: "logist", select: "firstName lastName" },
  ]);
  return orders;
}

export async function getOrderById(orderId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
}

export async function orderAssign(orderId, logistId) {
  const order = await getOrderById(orderId);
  const logist = await getUserById(logistId);
  if (logist.role !== "logist") {
    throw new Error("Only logists can be assigned to orders");
  }

  order.logist = logist._id;
  await order.save();
  logist.logistOrders.push(order._id);
  await logist.save();

  return order;
}

export async function deleteOrder(orderId) {
  const order = await getOrderById(orderId);
  await order.deleteOne();
  return order;
}
